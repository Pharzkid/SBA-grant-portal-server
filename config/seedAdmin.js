// server/config/seedAdmin.js
// Add this line at the very top of the file
import User from '../models/User.js';

// ... rest of the imports (like config) ...
import config from './config.js';



const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: config.ADMIN_EMAIL });

        if (!adminExists) {
            // 1. Create a new User instance (which uses the model)
            const adminUser = new User({
                firstName: 'Portal',
                lastName: 'Admin',
                email: config.ADMIN_EMAIL,
                password: config.ADMIN_PASSWORD, // Plain text password
                dob: '1980-01-01',
                address: '123 Admin St',
                state: 'CA',
                country: 'USA',
                mobileNumber: '555-123-4567',
                occupation: 'Administrator',
                purpose: 'System maintenance and management.',
                isAdmin: true,
                balance: 0,
            });

            // 2. Save the user, which triggers the pre('save') hashing hook
            await adminUser.save(); 
            
            console.log(`Admin user created: ${adminUser.email}`);
        } else {
            // OPTIONAL: Ensure existing admin has the isAdmin flag set, just in case
            if (!adminExists.isAdmin) {
                adminExists.isAdmin = true;
                await adminExists.save();
                console.log(`Existing user ${adminExists.email} updated to Admin.`);
            }
        }
    } catch (error) {
        console.error(`Error seeding admin user: ${error.message}`);
    }
};

export default seedAdmin;