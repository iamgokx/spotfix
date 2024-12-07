
const { sendOtpEmail, generateOtp } = require('./generateOtp')
let otpStore = {};

const userRequestsOtp = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const otp = generateOtp();
    console.log('Generated OTP:', otp);

    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    const emailSent = await sendOtpEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
    }

    return res.status(200).json({ message: 'OTP sent successfully', email });
  } catch (error) {
    console.error('Error processing OTP request:', error.message || error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const verifyOtp = (req, res) => {
  const { email, otp } = req.query;
  const otpData = otpStore[email];

  if (!otpData) {
    return res.status(400).json({ message: 'OTP not found' });
  }

  if (otpData.expiresAt < Date.now()) {
    delete otpStore[email];
    return res.status(400).json({ message: 'OTP has expired' });
  }

  if (otpData.otp === otp) {
    delete otpStore[email];
    console.log('OTP is valid');
    res.json({ message: 'OTP verified successfully', userStatus : true });
  }

  if (otpData.otp !== otp) {
    console.log('OTP does not match');
    return res.json({ message: "Invalid OTP", otpStatus: false });
  }

};


module.exports = {
  userRequestsOtp,
  verifyOtp
}