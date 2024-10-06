import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './FileUploadComponent.css'; 
import { Link } from 'react-router-dom';

const FileUploadComponent = ({ setMalwareCount, setMostCommonType, setMostCommonCount }) => {
  const [fileName, setFileName] = useState(null);
  const [file, setFile] = useState(null);
  const [fileSize, setFileSize] = useState(null);
  const [scanProgress, setScanProgress] = useState('');
  const [scanComplete, setScanComplete] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFileName(selectedFile.name);
    setFile(selectedFile);
    setFileSize((selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB');
    setScanComplete(false);
    setScanProgress('');
  }, []);

  const handleScan = () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
      setScanProgress('Scanning...');
      setScanComplete(false);
  
      axios.post('http://localhost:5000/upload', formData)
        .then(response => {
          const { malware_count, most_common_type, most_common_count } = response.data;
  
          setMalwareCount(malware_count);
          setMostCommonType(most_common_type);
          setMostCommonCount(most_common_count);  // Set the most common malware count
  
          setScanProgress('Scan completed successfully!');
          setScanComplete(true);
        })
        .catch(error => {
          setScanProgress('Error during scan.');
          console.error("Scan error:", error);
        });
    }
  };

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
      <div className={`upload-box dropzone ${file ? 'uploaded' : ''}`} {...getRootProps()}>
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

      <div className="scan-button-wrapper">
        <button className="scan-button" onClick={handleScan} disabled={!file}>Scan</button>
      </div>

      {scanProgress && (
        <p className={`scan-progress ${scanComplete ? 'completed' : 'in-progress'}`}>
          {scanProgress}
        </p>
      )}

      {scanComplete && (
        <Link to="/reports">
          <button className="reports-button">Go to Reports</button>
        </Link>
      )}
    </div>
  );
};

export default FileUploadComponent;
