import express from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Config from '../models/Config.js';
import { sendRegistrationEmail } from '../utils/emailService.js';

const router = express.Router();

// Helper function to generate JWT
const generateToken = (id) => {
    // Uses the ID to sign the token
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// --- REGISTER ROUTE ---
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post(
    '/register',
    asyncHandler(async (req, res) => {
        const { email, password, firstName, lastName, ...rest } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        // 1. Generate Random Balance ($25,000 to $45,000)
        const minBalance = 25000;
        const maxBalance = 45000;
        const randomBalance = Math.floor(Math.random() * (maxBalance - minBalance + 1)) + minBalance;

        // 2. Create User in MongoDB
        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            balance: randomBalance,
            ...rest,
        });

        if (user) {
            // 3. Send Email Notification
            await sendRegistrationEmail(user.email);
            
            // 4. Return response to client
            res.status(201).json({
                message: 'Registration successful. Email sent.',
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    email: user.email,
                    balance: user.balance,
                    isAdmin: user.isAdmin, // Included here as well
                },
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    })
);

// --- LOGIN ROUTE ---
// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
router.post(
        '/login',
        asyncHandler(async (req, res) => {
            const { email, password } = req.body;
    
            // 1. Find User in DB
            const user = await User.findOne({ email });
    
            if (user && (await user.matchPassword(password))) {
                // 2. Successful Login
                
                // Determine the role for easy client-side redirect
                const userRole = user.isAdmin ? 'admin' : 'user';
    
                res.json({
                    // CRITICAL: Send the role at the root level
                    role: userRole, 
                    // Token is also at the root level
                    token: generateToken(user._id), 
                    user: {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName, 
                        email: user.email,
                        balance: user.balance,
                        // isAdmin is still in user object but client doesn't need to dive in
                        isAdmin: user.isAdmin, 
                    },
                });
            } else {
                res.status(401);
                throw new Error('Invalid email or password');
            }
        })
    );
export default router;