import React, { useState } from "react";
import axios from "axios";
import "./output.css";

function App() {
  const [baseId, setBaseId] = useState("");
  const [tableName, setTableName] = useState("");
  const [accountCreator, setAccountCreator] = useState("Jim"); // Account creator currently defaults to Jim

  // Account creators object
  const accountCreators = {
    Jim: "Jim",
    Jan: "Jan",
    Divine: "Divine",
    Billy: "Billy",
    Andres: "Andres",
    Tomas: "Tomas",
    Peter: "Peter",
  };

  // Base IDs object
  const baseIds = {
    Ria: "appo43Apz7nRKEm1P",
    Lorna: "appJounXVGADkLo8v",
    Sara: "appzimyozTNM7La0R",
    Nina: "appMZgx2LrGTJ10nw",
  };

  // Table Names object
  const tableNames = {
    Ria: "tblfpzvBDg8jQtEs2",
    Lorna: "tblAJ0i9ZPl5qAGzI",
    Sara: "tblqDStAD2yedAsr4",
    Nina: "tblDkMsePArlPQiOJ",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/download", {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Airtable Image Downloader
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Base ID:
            </label>
            <select
              value={baseId}
              onChange={(e) => setBaseId(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="" disabled>
                Select a Base ID
              </option>
              {Object.keys(baseIds).map((key) => (
                <option key={key} value={baseIds[key]}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Table Name:
            </label>
            <select
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="" disabled>
                Select a Table Name
              </option>
              {Object.keys(tableNames).map((key) => (
                <option key={key} value={tableNames[key]}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account Creator:
            </label>
            <select
              value={accountCreator}
              onChange={(e) => setAccountCreator(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {Object.keys(accountCreators).map((key) => (
                <option key={key} value={accountCreators[key]}>
                  {accountCreators[key]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Download Images
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
