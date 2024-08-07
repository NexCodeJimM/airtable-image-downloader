// src/App.js
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [baseId, setBaseId] = useState("");
  const [tableName, setTableName] = useState("");
  const [accountCreator, setAccountCreator] = useState("Jim"); // Default to Jim

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/download", {
        baseId,
        tableName,
        accountCreator,
      });
      console.log("Images downloaded successfully:", response);
    } catch (error) {
      console.error("Error downloading images:", error);
    }
  };

  return (
    <div>
      <h1>Airtable Image Downloader</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Base ID:</label>
          <input
            type="text"
            value={baseId}
            onChange={(e) => setBaseId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Table Name:</label>
          <input
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Account Creator:</label>
          <input
            type="text"
            value={accountCreator}
            onChange={(e) => setAccountCreator(e.target.value)}
            required
          />
        </div>
        <button type="submit">Download Images</button>
      </form>
    </div>
  );
}

export default App;
