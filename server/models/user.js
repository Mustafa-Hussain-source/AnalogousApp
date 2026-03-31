import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  username: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ["active", "disabled"],
    default: "active"
  },
  failedAttempts: {
    type: Number,
    default: 0
  },
  lastLogin: {
    type: Date
  },
  device: {
    type: String
  },
  ip: {
    type: String
  },
  location: {
    type: String
  }

}, { timestamps: true });


userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);