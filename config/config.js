// This file is reserved for defining configuration constants
// that might be used across different parts of the application,
// such as grant limits, external service URLs, or system messages.

const config = {
    // Defines the limits for the random balance generation
    GRANT_MIN_BALANCE: 25000,
    GRANT_MAX_BALANCE: 45000,

    // Default admin login (for initial setup/testing)
    ADMIN_EMAIL: 'admin@gmail.com',
    ADMIN_PASSWORD: 'admin100',
    
    // Default message key for the Config model
    WITHDRAWAL_MESSAGE_KEY: 'withdrawalMessage',
};

export default config;