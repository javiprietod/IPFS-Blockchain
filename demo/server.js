import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import { create } from 'ipfs-http-client';

const app = express();
const upload = multer({ dest: 'uploads/' });
const ipfs = create({ url: 'http://127.0.0.1:5001' });

app.use(cors());
app.use(express.static('public'));

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const fileStream = fs.createReadStream(req.file.path);
    const result = await ipfs.add(fileStream);
    fs.unlinkSync(req.file.path);
    res.json({ cid: result.path });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload to IPFS' });
  }
});

app.listen(3000, () => {
  console.log('🚀 Server running');
});
