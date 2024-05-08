# Azure Blob Storage and MongoDB Image Upload API

This Node.js application demonstrates the integration of Azure Blob Storage for file uploads and MongoDB for storing image metadata. The application allows the uploading of images (and other documents) through a simple HTTP API and stores pertinent metadata in MongoDB.

## Features

- **File Uploads**: Upload images and documents to Azure Blob Storage.
- **Metadata Storage**: Store image metadata, such as file name, caption, and file type, in MongoDB.

## Prerequisites

- Node.js installed on your system.
- An active Azure account with access to Azure Blob Storage.
- A MongoDB database.
- An `.env` file configured with necessary environment variables.

## Environment Variables

Create a `.env` file in the root of your project and add the following environment variables:

```plaintext
MONGODB_URI=<Your MongoDB connection URI>
ACCOUNT_NAME=<Your Azure Storage account name>
SAS_TOKEN=<Your Azure SAS token>
CONTAINER_NAME=<Your Azure Blob Storage container name>
```

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory:**

   ```bash
   cd <project-directory>
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

## Running the Application

1. **Start the server:**

   ```bash
   node app.mjs
   ```

   The server will start on port 3000.

## API Usage

### Upload Image

**POST** `/api/upload`

Upload an image or document to Azure Blob Storage and store its metadata in MongoDB.

#### Headers

- `Content-Type`: Must be of the type `multipart/form-data`.
- `x-caption`: Caption for the image (optional).

#### Response

- **201 Created**: On successful upload and metadata storage.
- **500 Internal Server Error**: On failure due to server errors.
- **404 Not Found**: If the endpoint is incorrect.

## Contributing

Contributions to enhance the functionality, improve documentation, or fix issues are welcome.

## License

This project is open-sourced under the MIT License.

## Contact

For support or queries, reach out via LinkedIn www.linkedin.com/in/ali-jone-merchant 

