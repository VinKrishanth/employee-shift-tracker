import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the employee schema
const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
      trim: true,
    },
    lastName: {
      type: String,
      default: '',
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v), 
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePicture: {
      type: String,
      default: '', 
    },
    phoneNumber: {
      type: String,
      default: '', 
    },
    role: {
      type: String,
      enum: ['admin', 'employee'],
      default: 'employee',
    },
  },
  {
    timestamps: true, 
    minimize: false, 
  }
);

// Pre-save hook to hash the password before saving to the database
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); 
  this.password = await bcrypt.hash(this.password, 10); 
  next();
});

// Method to compare password for login
adminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password); 
};

// Create the employee model from the schema
const Employee = mongoose.models.Employee || mongoose.model('Employee', adminSchema);

export default Employee;
