const fs = require('fs');
const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');   // ✅ add this

const envPath = fs.existsSync(path.join(__dirname, '.env'))
  ? path.join(__dirname, '.env')
  : path.join(__dirname, 'projects', '.env');
require('dotenv').config({ path: envPath });
console.log(`Loaded env from ${envPath}`);

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allow requests from your Vercel frontend
app.use(cors({
  origin: "https://portfolio-colman.vercel.app", 
  methods: ["GET", "POST"],
}));

app.use(express.json());
app.disable('etag');
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  next();
});
app.use(express.static(path.join(__dirname), { etag: false, maxAge: 0 }));

// ... rest of your nodemailer + /send route code ...
