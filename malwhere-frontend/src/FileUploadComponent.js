import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './FileUploadComponent.css'; 
import { Link } from 'react-router-dom';

const FileUploadComponent = () => {
  const [fileName, setFileName] = useState(null);  
  const [file, setFile] = useState(null);          
  const [fileSize, setFileSize] = useState(null);  
  const [scanProgress, setScanProgress] = useState('');     
  const [scanComplete, setScanComplete] = useState(false);  

  // Handle file drop event
  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFileName(selectedFile.name);  
    setFile(selectedFile);           
    setFileSize((selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB'); 
    setScanComplete(false);  
    setScanProgress('');     
  }, []);

  // Trigger the scan process when the user clicks the "Scan" button
  const handleScan = () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      // Show scan progress message with animation
      setScanProgress('Scanning...');
      setScanComplete(false);

      // Simulate a scan delay
      setTimeout(() => {
        axios.post('http://localhost:5000/upload', formData)
        .then(response => {
          setScanProgress('Scan completed successfully!');
          setScanComplete(true);
        })
        .catch(error => {
          setScanProgress('Error during scan.');
          console.error("Scan error:", error);
        });
      }, 2000); 
    }
  };

  // Clear the file if the user clicks the trash icon
  const handleDeleteFile = () => {
    setFileName(null);
    setFile(null);
    setFileSize(null);
    setScanProgress('');
    setScanComplete(false);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="file-upload-container">
      <div
        className={`upload-box dropzone ${file ? 'uploaded' : ''}`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="cloud-icon material-symbols-outlined">cloud_upload</div>
        
        {!file && <p>Drag 'n' drop or click to select a file</p>}

        {file && (
          <div className="file-info">
            <span className="file-name">{fileName}</span>
            <span className="file-size">({fileSize})</span>
            <span className="material-symbols-outlined delete-icon" onClick={handleDeleteFile}>delete</span>
          </div>
        )}
      </div>

      {/* Scan Button */}
      <div className="scan-button-wrapper">
        <button className="scan-button" onClick={handleScan} disabled={!file}>
          Scan
        </button>
      </div>

      {/* Display animated scan progress message */}
      {scanProgress && (
        <p className={`scan-progress ${scanComplete ? 'completed' : 'in-progress'}`}>
          {scanProgress}
        </p>
      )}

      {/* Show Reports button if scan is complete */}
      {scanComplete && (
        <Link to="/reports">
          <button className="reports-button">Go to Reports</button>
        </Link>
      )}
    </div>
  );
};

export default FileUploadComponent;
