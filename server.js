const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());

const upload = multer({ limits: { fileSize: 20 * 1024 * 1024 } }); // 20MB limit

app.post('/upload', upload.single('file'), async (req, res) => {
  const { name, email, message } = req.body;
  const file = req.file;

  if (!file) return res.status(400).send('No file uploaded.');

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.user,
      pass: process.env.pass
    }
  });

  const mailOptions = {
    from: email,
    to: 'sendphoto@fixmyphoto.in',
    subject: `New File Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    attachments: [
      {
        filename: file.originalname,
        content: file.buffer
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send('✅ File sent successfully to your inbox!');
  } catch (error) {
    console.error(error);
    res.status(500).send('❌ Failed to send email.');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
