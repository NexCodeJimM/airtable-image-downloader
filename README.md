# Airtable Image Downloader

This project is designed to download images from an Airtable base, filter them based on specific criteria, and compress them into a ZIP file for download. The downloader is implemented using Node.js and Express for the backend and React for the frontend.

## Features

- Fetches image URLs from Airtable records.
- Filters records based on "Status" and "Account Creator".
- Downloads images and saves them in a structured folder.
- Creates a ZIP file of the downloaded images.
- Provides a simple React frontend for inputting Airtable details.

## Prerequisites

- Node.js
- npm (Node Package Manager)
- Airtable account with API key
- React

## Installation

1. Clone the repository:

```
git clone https://github.com/yourusername/airtable-image-downloader.git
cd airtable-image-downloader
```

2. Install dependencies:

```
npm install
```

3. Create a `.env` file in the server directory and add your Airtable API key:

```
AIRTABLE_ACCESS_TOKEN=your_airtable_api_key
```

4. Start the backend server:

```
npm start
```

5. Navigate to the `airtable-downloader` directory, install dependencies, and start the React app:

```
cd client
npm install
npm start
```

## Usage

1. Open your browser and go to http://localhost:3000.
2. Enter your Airtable base ID, table name, and account creator name.
3. Click on "Download Images" to start the download process.

## File Structure

- `index.mjs`: The main server file that handles image downloading and zipping.
- `airtable-downloader/src/App.js`: The React frontend for inputting Airtable details.

## License

This project is licensed under the MIT License.
