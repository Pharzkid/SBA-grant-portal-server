// Array to store notifications sent by the admin (from User.js)
notifications: [
    {
        message: { type: String, required: true },
        date: { type: Date, default: Date.now },
        read: { type: Boolean, default: false }
    }
]