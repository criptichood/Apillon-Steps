import express, { Request, Response } from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to handle CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Route for file upload
app.post('/upload/:bucketUuid', async (req: Request, res: Response) => {
  try {
    const { bucketUuid } = req.params;
    const { files } = req.body;

    const formData = new FormData();
    (files as any[]).forEach((file) => {
      formData.append('files', file);
    });

    const apiKey = process.env.API_KEY;
    const apiSecret = process.env.API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({ error: 'API key or secret not found in environment variables' });
    }

    const response = await fetch(`https://api.apillon.io/storage/buckets/${bucketUuid}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`,
      },
      body: formData,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error proxying upload request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
