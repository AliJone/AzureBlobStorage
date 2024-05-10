import http from 'http';
import { BlobServiceClient } from '@azure/storage-blob';
import { MongoClient } from 'mongodb';
import 'dotenv/config';


const mongodbUri = process.env.MONGODB_URI;
const accountName = process.env.ACCOUNT_NAME;
const sasToken = process.env.SAS_TOKEN;
const containerName = process.env.CONTAINER_NAME;

const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasToken}`);
const containerClient = blobServiceClient.getContainerClient(containerName);

const client = new MongoClient(mongodbUri);
await client.connect();

const server = http.createServer(handleImageUpload);
server.listen(3000, () => {
  console.log('Server listening on port 3000');
});

async function extractMetadata(headers) {
    const contentType = headers['content-type'];
    const contentDisposition = headers['content-disposition'];

    if (!contentType || !contentDisposition) {
        throw new Error('Missing required headers');
    }

    const fileType = contentType.split('/')[1];
    const caption = headers['x-caption'];
    const matches = /filename="([^"]+)/i.exec(contentDisposition);
    const fileName = matches ? matches[1] : `image-${Date.now()}.${fileType}`;

    return { fileName, caption, fileType };

}

async function uploadImageStream(blobName, dataStream) {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadStream(dataStream);
    return blockBlobClient.url;

}

async function storeMetadata(name, caption, fileType, imageUrl) {
    const database = client.db('images');
    const collection = database.collection('metadata');

    await collection.insertOne({
        name,
        caption,
        fileType,
        imageUrl,
        createdAt: new Date(),
    });

}

async function handleImageUpload(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('x-ms-blob-type', 'BlockBlob');
    //set req headers
    req.headers['x-ms-blob-type'] = 'BlockBlob';

    if (req.url === '/api/upload' && req.method === 'POST') {
        try {
            const {fileName, caption, fileType} = await extractMetadata(req.headers);

            const imageUrl = await uploadImageStream(fileName, req);

            await storeMetadata(fileName, caption, fileType, imageUrl);

            res.writeHead(201);
            res.end(JSON.stringify({ message: 'Image uploaded, metadata stored' }));
        } catch (error) {
            console.log(error);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
    }
}