const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const renameAsync = promisify(fs.rename);
const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

const upload = multer({ dest: '/tmp/uploads/' });
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/upload', upload.array('files'), async (req, res) => {
    try {
        const uploadedFiles = [];
        for (const file of req.files) {
            const tempPath = file.path;
            const targetPath = path.join('/tmp/uploads', file.originalname);

            await renameAsync(tempPath, targetPath);
            uploadedFiles.push({
                name: file.originalname,
                date: new Date()
            });
        }
        res.status(200).json({ message: 'Files uploaded successfully', files: uploadedFiles });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/files', async (req, res) => {
    try {
        const files = await readdirAsync('/tmp/uploads');
        const fileDetails = await Promise.all(files.map(async (file) => {
            const filePath = path.join('/tmp/uploads', file);
            const stats = await statAsync(filePath);
            return {
                name: file,
                date: stats.mtime
            };
        }));
        res.status(200).json(fileDetails);
    } catch (err) {
        res.status(500).json({ error: 'Unable to scan files' });
    }
});

module.exports = app;
