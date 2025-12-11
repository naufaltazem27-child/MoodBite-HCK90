// helpers/email.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "MoodBite Security <security@childstudio.web.id>",
      to: [email],
      subject: "Your Login OTP Code",
      html: `
        <div style="font-family: sans-serif; text-align: center; color: #333;">
            <h1 style="color: #ea580c;">MoodBite 😋</h1>
            <p>You requested to change your password.</p>
            <p>Your Verification Code is:</p>
            <div style="background: #FFF8E1; color: #ea580c; display: inline-block; padding: 15px 30px; border-radius: 12px; margin: 20px 0;">
                <h2 style="margin: 0; letter-spacing: 8px; font-size: 32px;">${otp}</h2>
            </div>
            <p style="font-size: 12px; color: #666;">This code expires in 5 minutes.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      throw new Error("Failed to send email");
    }

    console.log("Email sent successfully:", data);
    return data;
  } catch (err) {
    throw err;
  }
};

module.exports = { sendOTP };
