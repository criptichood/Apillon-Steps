import React, { useState } from 'react';
import { Button, Container, Typography, Box, CircularProgress } from '@mui/material';
import { Storage } from '@apillon/sdk';


// Define the FileMetadata interface to match the SDK's interface
interface FileMetadata {
  fileName: string;
  content: Buffer; // Change the type to Buffer
}

interface FileUploaderProps {
  apiKey: string;
  apiSecret: string;
  bucketUuid: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ apiKey, apiSecret, bucketUuid }) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;
    setUploading(true);

    const storage = new Storage({
     
      key: apiKey,
      secret: apiSecret,
    });

    try {
      const fileMetadataArray: FileMetadata[] = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const buffer = await readFileAsBuffer(file);
        fileMetadataArray.push({
          fileName: file.name,
          content: buffer,
        });
      }

      // Assuming the SDK method expects an array of FileMetadata objects
      await storage.bucket(bucketUuid).uploadFiles(fileMetadataArray);

      alert('Files uploaded successfully!');
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    } finally {
      setUploading(false);
      setSelectedFiles(null);
    }
  };

  const readFileAsBuffer = (file: File): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const arrayBuffer = event.target.result as ArrayBuffer;
          const buffer = Buffer.from(arrayBuffer);
          resolve(buffer);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = (_event) => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsArrayBuffer(file);
    });
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
