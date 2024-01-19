const bcrypt = require("bcrypt");
const { sendOTP } = require("./emailSender");

const sendOTPVerification = async (user, res) => {
  const otp = await generateOTP();
  user.otpVerification = {
    otp: otp.hashedOTP,
    expiresAt: Date.now() + 300000,
  };

  await sendOTP(user.email, otp.otp);
  await user.save();

  return res.status(200).json({
    message: `OTP has been sent successfully`,
    userId: user._id,
  });
};

const sendResetOTP = async (user, res) => {
  const otp = await generateOTP();
  user.reset = {
    otp: otp.hashedOTP,
    expiresAt: Date.now() + 300000,
  };

  await sendOTP(user.email, otp.otp);
  await user.save();

  return res.status(200).json({
    message: `Reset OTP has been sent successfully`,
    userId: user._id,
  });
};

const generateOTP = async () => {
  const otp = Math.floor(Math.random() * 9000) + 1000;
  console.log("OTP: ", otp);
  const hashedOTP = await bcrypt.hash(otp, 10);
  return { otp, hashedOTP };
};

module.exports = {
  sendOTPVerification,
  generateOTP,
  sendResetOTP,
};
