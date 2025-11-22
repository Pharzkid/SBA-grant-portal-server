import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/authMiddleware.js';
import Config from '../models/Config.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Get current user profile and dashboard data
// @route   GET /api/user/profile
// @access  Private (User only)
router.get(
    '/profile',
    protect, // Requires JWT token
    asyncHandler(async (req, res) => {
        // req.user is set by the 'protect' middleware
        const user = await User.findById(req.user._id).select('-password');
        
        if (user) {
            res.json({
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                balance: user.balance,
                address: user.address,
                mobileNumber: user.mobileNumber,
                notifications: user.notifications, // Send user notifications
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    })
);

// @desc    Get the global withdrawal message (used by WithdrawalSection component)
// @route   GET /api/user/withdrawal-message
// @access  Private (User only)
router.get(
    '/withdrawal-message',
    protect,
    asyncHandler(async (req, res) => {
        // Fetch the configuration set by the admin
        const config = await Config.findOne({ key: 'global_withdrawal_message' });

        const defaultMessage = "withdrawal not possible right, 2.5% Fee not confirmed yet contact us or continue with your agent.";

        res.json({
            message: config ? config.value : defaultMessage
        });
    })
);

export default router;