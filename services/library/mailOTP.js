import nodemailer from "nodemailer";
import logger from "../../logger.js";
import dotenv from 'dotenv';
dotenv.config();

const user = process.env.EMAIL_USERNAME;
const pass = process.env.EMAIL_APP_PASS;
const host = process.env.EMAIL_HOST;
const port = process.env.EMAIL_PORT;

const generateTransporter = () => {
  const transporter = nodemailer.createTransport({
    service: host === "smtp.gmail.com" ? "gmail" : undefined,
    host: host,
    port: parseInt(port),
    secure: false, // Consider setting `true` for secure SMTP connections on port 465
    auth: {
      user: user,
      pass: pass,
    },
  });

  return transporter;
};

async function sendOTPOnEmail({ to, subject, html }) {
  try {
    console.log("in mailOTP lib", to, subject, html);
    
    const transporter = generateTransporter();
    await transporter.sendMail({
      from: 'Shop@Ease.com',
      to: to,
      subject: subject,
      html: html,
    });
    return {
      success: true,
      message: "OTP sent to your email address",
    };
  } catch (err) {
    logger.error(`Error while sending OTP email: ${err.message}`);
    throw err;
  }
}

export default sendOTPOnEmail;
