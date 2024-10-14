const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { USERS } = require('../Models/user.js');
const { env } = require('../../env_constants.js');
const { logWriter } = require('../Logger/LogWriter.js');
const { sendVerificationMail, sendPasswordResetEmail } = require('../NotificationHandler/mailHandler.js');

const loginrouter = express.Router();
const logger = logWriter('LOGIN-ROUTER');

// // Middleware to log requests
// loginrouter.use((req, res, next) => {
//   logger.info({
//     message: 'Incoming request',
//     path: req.path,
//     method: req.method,
//     ip: req.ip,
//     body: req.body,
//   });
//   next();
// });



// Route to sign up
loginrouter.post('/signup', async (req, res) => {
  const { userID } = req.body.userData;
  const { userData } = req.body;

  try {
    const userExists = await USERS.findOne({ userID });

    if (userExists) {
      logger.error({ message: 'User already exists', userID });
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 8);
    const newUserDoc = {
      ...userData,
      password: hashedPassword,
      role: 'emp',
    };

    const returnedDoc = await USERS.create(newUserDoc);

    logger.info({ message: 'User added successfully', userID });
    return res.status(200).json({ status: 'success' });
  } catch (error) {
    logger.error({ message: 'Failed to add user', error: error.message, userID });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to resend verification mail
loginrouter.post('/sendverificationmail', async (req, res) => {
  const { userID } = req.body;

  try {
    const userExists = await USERS.findOne({ userID });

    if (!userExists) {
      logger.error({ message: 'User not found', userID });
      return res.status(400).json({ error: 'User not found' });
    }

    await sendVerificationMail(userID);
    logger.info({ message: 'Verification mail sent successfully', userID });
    return res.status(200).json({ status: 'success' });

  } catch (error) {
    logger.error({ message: 'Failed to send verification mail', error: error.message, userID });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to verify email
loginrouter.post('/verifyemail', async (req, res) => {
  const { mailtoken } = req.body;

  try {
    if (!mailtoken) {
      logger.warn('Token required for email verification');
      return res.status(400).json({ error: 'Token required' });
    }

    const decoded = jwt.verify(mailtoken, env.JWT_TOKEN_ENCRYPT_CODE);
    const userID = decoded.userID;

    const userObj = await USERS.findOne({ userID });
    if (!userObj) {
      logger.error({ message: 'Invalid token or user not active', userID });
      return res.status(401).json({ error: 'Invalid token or user not active' });
    }

    logger.info({ message: 'Email verified successfully', userID });

    const token = jwt.sign({ userID: userID.toString(), role: req.role }, env.JWT_TOKEN_ENCRYPT_CODE);

    const updateResult = await USERS.updateOne(
      { userID },
      { $set: { lastaccesstime: new Date().getTime(), verified: true } }
    );

    if (updateResult.nModified === 0) {
      logger.error({ message: 'Failed to update user', userID });
      return res.status(400).json({ error: 'Email verification error' });
    }

    const { firstname, lastname, verified, role } = userObj;

    return res.status(200).json({
      status: 'success',
      token,
      firstname,
      lastname,
      userID,
      role,
      verified
    });
  } catch (error) {
    logger.error({ message: 'Failed to verify email', error: error.message });
    return res.status(500).json({ error: 'Internal server error' });
  }
});
//Router to handle Login
loginrouter.post('/login', async (req, res) => {
  const { userID, password } = req.body;
  try {
    if (!userID || !password) {
      return res.status(401).json({ message: 'Invalid userID or password' });
    };

    const user = await USERS.findOne({ userID });

    if (!user) {
      return res.status(401).json({ message: 'Invalid userID or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid userID or password' });
    }

    const token = jwt.sign({ userID: user.userID }, env.JWT_TOKEN_ENCRYPT_CODE);
    const { firstname, lastname, verified, role } = user;

    return res.status(200).json({
      status: 'success',
      token,
      firstname,
      lastname,
      userID,
      verified,
      role
    });
  } catch (error) {
    console.log(error);
    logger.error({ message: 'Failed to Login', error: error.message });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to handle forgot password
loginrouter.post('/forgotpassword', async (req, res) => {
  const { userID } = req.body;

  try {
    const userObj = await USERS.findOne({ userID });
    if (!userObj) {
      logger.error({ message: 'User not found', userID });
      return res.status(400).json({ error: 'User not found' });
    }

    await sendPasswordResetEmail(userID);
    logger.info({ message: 'Password reset email sent', userID });
    return res.status(200).json({ status: 'success' });

  } catch (error) {
    logger.error({ message: 'Failed to send password reset email', error: error.message, userID });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to reset password
loginrouter.post('/resetpassword', async (req, res) => {
  try {
    const { resettoken, newpassword } = req.body;
    if (!resettoken || !newpassword) {
      return res.status(400).json({ error: 'Token and Password required' });
    };

    const decoded = jwt.verify(resettoken, env.JWT_TOKEN_ENCRYPT_CODE);
    const userID = decoded.userID;

    const hashedPassword = await bcrypt.hash(newpassword, 8);
    const updateResult = await USERS.updateOne(
      { userID },
      { $set: { password: hashedPassword } }
    );

    if (updateResult.nModified === 0) {
      logger.error({ message: 'Failed to update password', userID });
      return res.status(400).json({ error: 'Password update failed' });
    }

    logger.info({ message: 'Password reset successfully', userID });
    return res.status(200).json({ status: 'success' });

  } catch (error) {
    logger.error({ message: 'Failed to reset password', error: error.message });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = { loginrouter };
