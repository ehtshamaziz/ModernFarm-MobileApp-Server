const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

const sendEmail = async (to, subject, content) => {
  let mailOptions = {
    from: `Modern Farm <${process.env.NODEMAILER_EMAIL}>`,
    to: to,
    subject: subject,
    html: content,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    throw new Error(`Error sending email: ${error.message}`);
  }
};

const sendEmailFile = async ( backupFileName,backupFilePath) => {
  let mailOptions = {
    from: `Modern Farm <${process.env.NODEMAILER_EMAIL}>`,
        to: "ehttimalik@hotmail.com",
        subject: 'Your Backup File',
        text: 'Please find your backup file attached.',
        attachments: [
          {
            filename: backupFileName,
            path: backupFilePath,
          },
        ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    throw new Error(`Error sending email: ${error.message}`);
  }
};




const sendOTP = async (to, otp) => {
  const subject = "Modern Farm | OTP Verification Code";
  const content = `<html><body><div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; color: #333333; text-align: center; padding: 20px;"><h2 style="color: #4A90E2;">Your One-Time Password (OTP)</h2><p style="font-size: 16px;">Please use the following OTP to complete your authentication process:</p><div style="background-color: #F7F7F7; margin: 20px 0; padding: 10px; border-left: 5px solid #4A90E2;"><span style="font-size: 20px; font-weight: bold;">${otp}</span></div><p style="font-size: 14px;">This OTP is valid for 5 minutes and can only be used once.</p></div></body></html>`;
  await sendEmail(to, subject, content);
};

module.exports = {
  sendEmail,
  sendOTP,
  sendEmailFile
};
