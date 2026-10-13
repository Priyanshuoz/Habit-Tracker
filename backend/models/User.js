const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'Please enter your name'],
      trim: true,
    },
    email: {
      type: String,
      require: [true, 'Please enter your email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      require: [true, 'Please enter a password'],
      minlength: [4, 'Password must be at least 4 characters'],
    }
  },
  { timestamps: true }
);


//Middleware: Automatically hash password before saving to MongoDB
userSchema.pre('save', async function () {
  if(!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// Helper method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);