const twilio = require('twilio');
require('dotenv').config();

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

// Create Twilio client
const client = twilio(accountSid, authToken);

// Function to send SMS
const sendSMS = async (to, message) => {
  try {
    const result = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: to
    });

    console.log(`📱 SMS sent successfully to ${to} (SID: ${result.sid})`);
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error("❌ Error sending SMS:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendSMS };
