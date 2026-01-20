const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter (Gmail / any SMTP service)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // e.g. "gmail"
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS  // your email app password
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    console.log(`Sending email to: ${to}`);

    const mailOptions = {
      from: `"BabyBus App" <${process.env.EMAIL_USER}>`, // sender name + email
      to,
      subject,
      text,
      html: html || text
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent successfully to ${to} (MessageId: ${info.messageId})`);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };
