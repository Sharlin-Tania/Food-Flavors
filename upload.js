const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');

const app = express();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'foodflavors141@gmail.com', // Your Gmail email address
        pass: 'iuorzjjdbvdecszg'   // Your Gmail email password
    }
});

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'food'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Create a videos table if not exists


// Set up storage for uploaded videos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Destination folder
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + path.extname(file.originalname);
        cb(null, fileName);
    }
});

const upload = multer({ storage });

// Serve HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Upload.html');
});

// Handle video upload
app.post('/upload', upload.single('video'), (req, res) => {
    const videoPath = req.file.path;

    // Save video metadata to MySQL
    const videoData = {
        title: req.file.originalname,
        path: videoPath
    };

    db.query('INSERT INTO videos SET ?', videoData, (err, result) => {
        if (err) {
            console.error('Error saving video to MySQL:', err);
            res.status(500).send('Error saving video to database.');
            return;
        }

        console.log('Video uploaded successfully to MySQL');
        res.send('Video uploaded successfully!');

        db.query('SELECT email FROM login', async (emailFetchError, emailRows) => {
            if (emailFetchError) {
                console.error('Error fetching emails from MySQL:', emailFetchError);
                res.status(500).send('Error fetching emails from the database.');
                return;
            }
        const recipientEmails = emailRows.map(row => row.email);
        const mailOptions = {
            from: 'foodflavors141@gmail.com', // Your Gmail email address
            to: recipientEmails.join(','), // Concatenate email addresses with commas
            subject: 'Video Upload Notification',
            text: 'The video has been successfully uploaded.'
        };
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email notification sent successfully.');
        } catch (emailError) {
            console.error('Error sending email notification:', emailError);
        }

        res.send('Video uploaded successfully!');
        }); 

    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
