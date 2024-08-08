import express from "express";
import fetch from "node-fetch";
import fs from "fs";
import archiver from "archiver";
import cors from "cors";
import dotenv from "dotenv";
import Airtable from "airtable";
import path from "path";
import { URL } from "url";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9-_\.]/g, "_");
};

const downloadImage = async (url, folder, filename) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
    }
    const contentType = res.headers.get("content-type");
    let extension = "";
    if (contentType) {
      switch (contentType) {
        case "image/jpeg":
        case "image/jpg":
          extension = ".jpg";
          break;
        case "image/png":
          extension = ".png";
          break;
        case "image/heic":
        case "image/heif":
          extension = ".heic";
          break;
        default:
          extension = "";
          break;
      }
    }

    const sanitizedFilename = sanitizeFilename(filename + extension);
    const filePath = path.join(folder, sanitizedFilename);

    const buffer = await res.buffer();
    fs.writeFileSync(filePath, buffer);
    console.log(`Downloaded image: ${filePath}`);
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error);
  }
};

const getGDriveDownloadLink = (gdriveUrl) => {
  try {
    const urlObj = new URL(gdriveUrl);
    const fileId = urlObj.searchParams.get("id");
    if (fileId) {
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  } catch (error) {
    console.error(
      `Invalid URL format for Google Drive link: ${gdriveUrl}`,
      error
    );
  }
  return gdriveUrl;
};

app.post("/download", async (req, res) => {
  const { baseId, tableName, accountCreator } = req.body;

  try {
    console.log("Fetching Airtable data...");
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_ACCESS_TOKEN,
    }).base(baseId);
    const records = await base(tableName).select().all();

    console.log("Airtable records:", records.length);

    if (!records || records.length === 0) {
      throw new Error("No records found in Airtable response");
    }

    // Filter records by Status and Account Creator
    const filteredRecords = records.filter((record) => {
      const status = record.fields["Status"];
      const creator = record.fields["Account Creator"];
      console.log(
        `Checking record: Status = ${status}, Account Creator = ${creator}`
      );
      return status === "Preparing Accounts" && creator === accountCreator;
    });

    console.log(
      `Found ${filteredRecords.length} records for Account Creator: ${accountCreator} with Status: Preparing Accounts`
    );

    // Create a temp folder to store images
    const tempDir = "./temp";
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    for (let record of filteredRecords) {
      const accountName = record.fields["Account Name"];
      const imageUrls = record.fields["Download Photos Here ↙️"];

      if (!accountName || !imageUrls) {
        console.log("Missing Account Name or Image URLs for record:", record);
        continue;
      }

      const accountDir = path.join(tempDir, sanitizeFilename(accountName));
      if (!fs.existsSync(accountDir)) {
        fs.mkdirSync(accountDir);
      }

      if (Array.isArray(imageUrls)) {
        for (let i = 0; i < imageUrls.length; i++) {
          const url = imageUrls[i];
          const downloadLink = getGDriveDownloadLink(url);
          const imageName = `Photo_${i + 1}`; // Naming as Photo_1, Photo_2, etc.
          console.log(
            `Downloading image: ${downloadLink} to ${accountDir}/${imageName}`
          );
          await downloadImage(downloadLink, accountDir, imageName);
        }
      } else {
        console.log("Image URLs is not an array:", imageUrls);
      }
    }

    // Create a zip file of the temp directory
    const output = fs.createWriteStream("./download.zip");
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    output.on("close", () => {
      console.log("ZIP file created successfully");
      res.download("./download.zip", "download.zip", (err) => {
        if (err) {
          console.error("Error sending zip file:", err);
          res.status(500).send(err);
        } else {
          console.log("File download completed.");
        }
      });
    });

    archive.on("error", (err) => {
      console.error("Archive error:", err);
      throw err;
    });

    archive.pipe(output);
    archive.directory(tempDir, false);
    archive.finalize();
  } catch (error) {
    console.error("Error during processing:", error);
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
