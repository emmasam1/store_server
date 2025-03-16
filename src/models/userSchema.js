const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    default: 'user',
  },
  avatar: {
    type: String,
    default: '',
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

userSchema.pre('save', function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
