import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    // --- Registration Fields ---
    firstName: { type: String, required: true },
    middleName: { type: String, required: false },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    homeNumber: { type: String, required: false },
    occupation: { type: String, required: true },
    purpose: { type: String, required: true, maxlength: 250 },

    // --- Grant/Dashboard Fields ---
    balance: {
      type: Number,
      required: true,
      default: 0, // Will be set to a random value on registration
    },
    // We can add a simple field to track if the user is an admin
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    // Array to store notifications sent by the admin
    notifications: [
        {
            message: { type: String, required: true },
            date: { type: Date, default: Date.now },
            read: { type: Boolean, default: false }
        }
    ]
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Middleware to hash password before saving (Security)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords (Authentication)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;