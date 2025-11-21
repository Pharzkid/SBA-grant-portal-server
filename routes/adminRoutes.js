import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, admin } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Config from '../models/Config.js';

const router = express.Router();

// Key name for the withdrawal message in the database (Must match Config component)
const WITHDRAWAL_MESSAGE_KEY = 'global_withdrawal_message';

// ------------------------------------
// 1. USER MANAGEMENT ROUTES
// ------------------------------------

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get(
    '/users',
    protect,
    admin, // Only accessible by admin users
    asyncHandler(async (req, res) => {
        // Fetch all users, excluding sensitive data like password and notifications array content
        const users = await User.find({}).select('-password -notifications');
        res.json(users);
    })
);

// ------------------------------------
// 2. NOTIFICATION ROUTES
// ------------------------------------

// @desc    Send a custom notification to a specific user
// @route   POST /api/admin/notify-user
// @access  Private/Admin
router.post(
    '/notify-user',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const { userId, message } = req.body;

        const user = await User.findById(userId);

        if (user) {
            // Use $push to add the new notification to the array
            user.notifications.push({
                message: message,
                date: new Date(),
                read: false,
            });

            await user.save();
            res.json({ message: `Notification sent to ${user.firstName}` });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    })
);


// @desc    Send a notification to ALL registered users
// @route   POST /api/admin/notify-all
// @access  Private/Admin
router.post(
    '/notify-all',
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const { message } = req.body;
        
        // Define the notification object to be added
        const newNotification = {
            message: message,
            date: new Date(),
            read: false,
        };

        // Use updateMany to push the notification to all user documents
        const result = await User.updateMany(
            {}, // Match all users
            { $push: { notifications: newNotification } }
        );

        res.json({ 
            message: `Global notification sent to ${result.nModified} user(s).`,
            usersUpdated: result.nModified
        });
    })
);


// ------------------------------------
// 3. CONFIGURATION ROUTES (UPDATED)
// ------------------------------------

// @desc    Get global configuration (e.g., withdrawal message)
// @route   GET /api/admin/config
// @access  Private/Admin
router.get(
    '/config', 
    protect, 
    admin, 
    asyncHandler(async (req, res) => {
        let configEntry = await Config.findOne({ key: WITHDRAWAL_MESSAGE_KEY });

        if (!configEntry) {
            configEntry = await Config.create({ 
                key: WITHDRAWAL_MESSAGE_KEY, 
                value: 'All withdrawal requests are currently being processed. Please allow 48-72 hours for funds to reflect in your account.'
            });
        }
        
        // Return only the value with the expected property name
        res.json({ withdrawalMessage: configEntry.value });
    })
);

// @desc    Update the global withdrawal message
// @route   PUT /api/admin/config
// @access  Private/Admin
router.put(
    '/config', // Changed route for cleaner access
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const { withdrawalMessage } = req.body; // Client sends { withdrawalMessage: "New message" }

        // Find and update the config entry using the correct key
        const configEntry = await Config.findOneAndUpdate(
            { key: WITHDRAWAL_MESSAGE_KEY },
            { value: withdrawalMessage }, // Update the 'value' property
            { new: true, upsert: true } 
        );

        res.json({ 
            message: 'Withdrawal message updated successfully', 
            // Return only the updated value
            withdrawalMessage: configEntry.value 
        });
    })
);

export default router;