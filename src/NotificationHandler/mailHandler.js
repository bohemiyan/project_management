const sgMail = require('@sendgrid/mail');
const { logWriter } = require('../Logger/LogWriter.js');
const jwt = require('jsonwebtoken');
const { env } = require('../../env_constants.js');

const logger = logWriter('SendGrid-Mail');
const sendgridToken = env.SENDGRID_API_KEY;

const jwtgenerator = async (userID) => {
  const payload = { userID };
  const options = { expiresIn: '30m' };
  const token = jwt.sign(payload, env.JWT_TOKEN_ENCRYPT_CODE, options);
  return token;
};

const sendPasswordResetEmail = async (email) => {
  try {
    const token = await jwtgenerator(email);
    const verificationLink = `${env.CLIENT_URL}/passwordreset?rt=${token}`;
    sgMail.setApiKey(sendgridToken);
    const msg = {
      to: email,
      from: 'netamerica.Elearning@outlook.com',
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>Hi,</p>
          <p>A password reset was requested for your account at Netamerica.</p>
          <p>Please click the link below to reset your password:</p>
          <p style="text-align: center;">
            <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Reset Password</a>
          </p>
          <p>This link is valid for 30 minutes from the time this reset was first requested.</p>
          <p>If you did not request this password reset, please ignore this email.</p>
          <p>If you need help, please contact the site administrator.</p>
          <p>Admin User</p>
        </div>
      `,
    };
    await sgMail.send(msg);
    logger.info(`Password reset email sent to ${email}`);
  } catch (error) {
    logger.error(`Error sending password reset email to ${email}: ${error.message}`);
    throw error;
  }
};

const sendVerificationMail = async (email) => {
  try {
    const token = await jwtgenerator(email);
    sgMail.setApiKey(sendgridToken);
    const verificationLink = `${env.CLIENT_URL}/emailverification?et=${token}`;

    const msg = {
      to: email,
      from: 'netamerica.Elearning@outlook.com',
      subject: 'Account Verification',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>Hi,</p>
          <p>Welcome to Netamerica!</p>
          <p>To verify your account, please click the following link:</p>
          <p style="text-align: center;">
            <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Verify your email</a>
          </p>
          <p>(This link is valid for 30 minutes from the time this email was sent.)</p>
          <p>If you did not sign up for an account, please ignore this email.</p>
          <p>If you need assistance, please contact our support team.</p>
          <p>Regards,</p>
          <p>The Netamerica Team</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    logger.info(`Verification email sent to ${email}`);
  } catch (error) {
    logger.error(`Error sending verification email to ${email}: ${error.message}`);
    throw error;
  }
};

module.exports = { sendPasswordResetEmail, sendVerificationMail };
