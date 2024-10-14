const express = require('express');
const bcrypt = require('bcryptjs');
const { USERS } = require('../Models/user');
const { AUTH } = require('../Middleware/authentication');
const { logWriter } = require('../Logger/LogWriter');


const userRouter = express.Router();
const logger = logWriter('User-ROUTER');
// Route to get user information

userRouter.get('/user', AUTH, async (req, res) => {
    return res.status(200).json({ status: 'success', user: req.userObj });
})

// Route to update user information
userRouter.put('/user', AUTH, async (req, res) => {
    try {
        let userData = req.body;
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 8);
        }

        const updatedUser = await USERS.findOneAndUpdate({userID:req.userID}, userData, { new: true });
        if (!updatedUser) {
            logger.warn({ message: 'User not found for update', userID: req.userID });
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        logger.info({ message: 'User information updated successfully', userID: req.userID });
        return res.status(200).json({ status: 'success', user: updatedUser });
    } catch (error) {
        logger.error({ message: 'Failed to update user information', error: error.message, userID: req.userID });
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

// Route to delete user
userRouter.delete('/user', AUTH, async (req, res) => {
    try {
        const deletedUser = await USERS.findByIdAndDelete(req.userID);
        if (!deletedUser) {
            logger.warn({ message: 'User not found for deletion', userID: req.userID });
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        logger.info({ message: 'User deleted successfully', userID: req.userID });
        return res.status(200).json({ status: 'success', message: 'User deleted successfully' });
    } catch (error) {
        logger.error({ message: 'Failed to delete user', error: error.message, userID: req.userID });
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

module.exports = { userRouter };