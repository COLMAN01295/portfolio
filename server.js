const fs = require('fs');
const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');

const envPath = fs.existsSync(path.join(__dirname, '.env'))
  ? path.join(__dirname, '.env')
  : path.join(__dirname, 'projects', '.env');
require('dotenv').config({ path: envPath });
console.log(`Loaded env from ${envPath}`);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.disable('etag');
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  next();
});
app.use(express.static(path.join(__dirname), { etag: false, maxAge: 0 }));

// Configure transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  family: 4,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify().then(() => {
  console.log('SMTP transporter ready');
}).catch((err) => {
  console.warn('SMTP transporter verification failed:', err && err.message);
});

app.post('/send', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });

  const mailOptions = {
    from: `"${name}" <${process.env.SMTP_USER}>`,
    to: process.env.TO_EMAIL || process.env.SMTP_USER,
    subject: `Portfolio contact from ${name}`,
    replyTo: email,
    text: `Message from ${name} <${email}>:\n\n${message}`,
    html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br/>')}</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent:', info && info.messageId);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Error sending mail:', err);
    return res.status(500).json({ error: err && err.message ? err.message : 'Failed to send message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
