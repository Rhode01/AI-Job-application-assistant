import React from 'react';
import { useState, useEffect } from 'react';
import { HOMEURL, CVUPLOAD } from './ENDPOINTS';

function App() {
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null); 

  useEffect(() => {
    fetch(HOMEURL)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((responseData) => setData(responseData))
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  const handleFileSubmit = () => {
    if (!file) {
      setUploadError("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch(CVUPLOAD, {
      method: "POST",
      body: formData,
      
    })
      .then((response) => {
        if (!response.ok) throw new Error("Upload failed");
        console.log(response.json())
        return response.json();
      })
      .then(() => {
        setFile(null);
        setUploadError(null);
        alert("File uploaded successfully!");
      })
      .catch((error) => {
        setUploadError("Error uploading file: " + error.message);
        console.error("Upload error:", error);
      });
  };

  return (
    <div className="home">
      <h1>APP</h1>
      {data && <p>{data.info}</p>}
      {uploadError && <p style={{ color: "red" }}>{uploadError}</p>}

      <h3>Upload your CV Below</h3>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        type="button"
        onClick={handleFileSubmit}
        disabled={!file}
        style={{ cursor: !file ? "not-allowed" : "pointer" }}
      >
        Upload CV
      </button>
    </div>
  );
}

export default App;