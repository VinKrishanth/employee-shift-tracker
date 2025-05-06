import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the employee schema
const employeeSchema = new mongoose.Schema(
  {
    salutation: {
      type: String,
      required: true,
      enum: ["Mr", "Ms", "Mrs", "Dr", "Prof"], 
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    birthName: {
      type: String,
      required: true,
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
    nationality: {
      type: String,
      required: true,
    },
    job: {
      type: String,
      required: true,
      default: "Trainee",
      enum: [
        "Trainee", 
        "Employee", 
        "Manager", 
        "Admin", 
        "Software Engineer", 
        "Senior Software Engineer", 
        "Lead Software Engineer", 
        "Software Architect"
      ],
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      pinCode: {
        type: String,
        required: true,
      },
    },
    telephoneNumber: {
      type: String,
      required: true,
    },
    bankDetails: {
      branchName: {
        type: String,
      },
      accountNumber: {
        type: String,
      },
      bankName: {
        type: String,
      },
    },
    profilePicture: {
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
employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); 
  this.password = await bcrypt.hash(this.password, 10); 
  next();
});

// Method to compare password for login
employeeSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password); 
};

// Create the employee model from the schema
const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

export default Employee;
