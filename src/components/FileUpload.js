import React, { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileUpload = ({ onFileSelect, label, accept, multiple = false }) => {
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB');
        return;
      }

      // Check file extension
      const fileExtension = file.name.split('.').pop().toLowerCase();
      // Remove dots from accept string and split into array
      const allowedExtensions = accept.split(',')
        .map(ext => ext.trim().toLowerCase().replace('.', ''));
      
      if (!allowedExtensions.includes(fileExtension)) {
        setError(`Invalid file type. Allowed types: ${accept}`);
        return;
      }

      setFileName(file.name);
      setError('');
      onFileSelect(file);
    }
  };

  return (
    <Box mb={2}>
      <input
        accept={accept}
        style={{ display: 'none' }}
        id={`file-upload-${label}`}
        type="file"
        onChange={handleFileChange}
        multiple={multiple}
      />
      <label htmlFor={`file-upload-${label}`}>
        <Button
          variant="contained"
          color="primary"
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          {label}
        </Button>
      </label>
      {fileName && (
        <Typography variant="body2" style={{ marginTop: 8 }}>
          Selected file: {fileName}
        </Typography>
      )}
      {error && (
        <Typography variant="body2" color="error" style={{ marginTop: 8 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload; 