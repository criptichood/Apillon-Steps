// FileUploader.tsx
import React, { useState } from 'react';
import { Button, Container, Typography, Box, CircularProgress } from '@mui/material';

interface FileUploaderProps {
  bucketUuid: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ bucketUuid }) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;
    setUploading(true);

    try {
      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('files', selectedFiles[i]);
      }

      const response = await fetch(`http://localhost:3001/upload/${bucketUuid}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Upload response:', data);
        alert('Files uploaded successfully!');
      } else {
        throw new Error('Failed to upload files');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    } finally {
      setUploading(false);
      setSelectedFiles(null);
    }
  };

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" align="center" gutterBottom>
          File Upload to Apillon Storage
        </Typography>
        <input
          accept="*"
          type="file"
          onChange={handleFileChange}
          multiple // Allow multiple file selection
        />
        <Box mt={2}>
          {selectedFiles && (
            <Typography variant="body1">{`${selectedFiles.length} files selected`}</Typography>
          )}
          {uploading && (
            <Box display="flex" alignItems="center">
              <CircularProgress size={24} />
              <Typography variant="body1" ml={1}>
                Uploading...
              </Typography>
            </Box>
          )}
        </Box>
        <Box mt={2} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            disabled={!selectedFiles || uploading}
            onClick={handleUpload}
          >
            Upload
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default FileUploader;
