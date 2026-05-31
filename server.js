const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(express.json());

// ✅ Allow your Vercel frontends
app.use(cors({
  origin: [
    "https://portfolio-colman.vercel.app",
    "https://portfolio-livid-seven-51x0q3bknn.vercel.app"
  ],
  methods: ["GET", "POST"],
}));

// ✅ Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // smtp.gmail.com
  port: process.env.SMTP_PORT, // 587
  secure: process.env.SMTP_SECURE === "true", // false
  auth: {
    user: process.env.SMTP_USER, // your Gmail
    pass: process.env.SMTP_PASS, // 16-char App Password
  },
});

// ✅ Verify transporter at startup
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP transporter verification failed:", error);
  } else {
    console.log("SMTP transporter ready");
  }
});

// ✅ Contact form route
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.SMTP_USER,
      subject: `Portfolio Contact from ${name}`,
      text: message,
    });

    res.json({ ok: true });
  } catch (error) {
    console.error("Error sending mail:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
