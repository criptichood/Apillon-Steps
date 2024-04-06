const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const FormData = require('form-data');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/upload/:bucketUuid', async (req, res) => {
  try {
    const { bucketUuid } = req.params;
    const { files } = req.body;

    const formData = new FormData();
    files.forEach((file) => {
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
