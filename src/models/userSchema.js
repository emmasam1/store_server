// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const { Schema } = mongoose;

// const UserSchema = new Schema(
//   {
//     firstName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     lastName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,  
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 6, 
//     },
//     role: {
//       type: String,
//       enum: ['user', 'admin'], 
//       default: 'user', 
//     },
//     avatar: {
//       type: String,
//       default: '', 
//     },
//     phoneNumber: {
//       type: String,
//       default: '', 
//     },
//     lastLogin: {
//       type: Date,
//       default: Date.now,
//     },
//     isActive: {
//       type: Boolean,
//       default: true, 
//     },
//   },
//   {
//     timestamps: true, 
//   }
// );


// UserSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 10); 
//   }
//   next();
// });


// UserSchema.methods.comparePassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };


// const User = mongoose.model('User', UserSchema);

// module.exports = User;
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: true,
//   },
//   lastName: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   role: {
//     type: String,
//     default: 'user',
//   },
//   avatar: {
//     type: String,
//     default: '',
//   },
//   phoneNumber: {
//     type: String,
//     default: '',
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
//   lastLogin: {
//     type: Date,
//     default: Date.now,
//   },
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);

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
    lowercase: true, // Ensure that email is stored in lowercase
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Password should be at least 6 characters long (or change as needed)
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

// Automatically convert the email to lowercase before saving
userSchema.pre('save', function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase(); // Convert email to lowercase
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
