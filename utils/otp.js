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

const sendWorkerOTPVerification = async (user, res) => {
  const otp = await generateOTP();
  user.otpVerification = {
    otp: otp.hashedOTP,
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
  try {
    const otp = Math.floor(Math.random() * 9000) + 1000;
    console.log("OTP: ", otp);

    const otpString = otp.toString();
    const hashedOTP = await bcrypt.hash(otpString, 10);
    return { otp, hashedOTP };
  } catch (err) {
    return err;
  }
};

module.exports = {
  sendOTPVerification,
  generateOTP,
  sendResetOTP,
  sendWorkerOTPVerification
};
