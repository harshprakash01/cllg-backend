const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const upload = multer({ dest: '/tmp/uploads/' });
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('uploads'));

app.post('/upload', upload.array('files'), (req, res) => {
    const uploadedFiles = [];
    req.files.forEach(file => {
        const tempPath = file.path;
        const targetPath = path.join(__dirname, 'uploads', file.originalname);

        fs.rename(tempPath, targetPath, err => {
            if (err) return res.sendStatus(500);
        });

        uploadedFiles.push({
            name: file.originalname,
            date: new Date()
        });
    });

    res.send('Files uploaded successfully');
});

app.get('/files', (req, res) => {
    fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan files');
        }

        const fileDetails = files.map(file => {
            const filePath = path.join(__dirname, 'uploads', file);
            const stats = fs.statSync(filePath);
            return {
                name: file,
                date: stats.mtime
            };
        });

        res.json(fileDetails);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
