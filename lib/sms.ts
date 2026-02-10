/**
 * Utility for sending SMS notifications.
 * Currently implemented as a mock for development.
 */
export async function sendPasswordResetSMS(phone: string, code: string) {
    // Only run on server
    if (typeof window !== 'undefined') return;

    console.log(`
📱 [SMS RECOVERY PROTOCOL]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Recipient: ${phone}
OTP Code:  ${code}
Expiry:    15 Minutes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status:    SIMULATED
  `);

    // In a real implementation, you would use a service like Twilio or Vonage here:
    /*
    const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    await client.messages.create({
      body: `Your HybridPOS secure reset code is: ${code}. Valid for 15 minutes.`,
      from: process.env.TWILIO_PHONE,
      to: phone
    });
    */

    return { success: true };
}
