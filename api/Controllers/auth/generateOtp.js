
const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASS,
  },
});


const sendOtpEmail = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: `Your OTP Code`,
      text: `Your OTP code is ${otp}`,
    });
    console.log('Email sent:', info.response);
    return true; // Return true if email is sent successfully
  } catch (error) {
    console.error('Error sending email:', error);
    return false; // Return false if there was an error
  }
};


const generateOtp = () => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  return otp;
}

module.exports = { sendOtpEmail, generateOtp };
