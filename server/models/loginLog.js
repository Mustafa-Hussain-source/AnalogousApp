import mongoose from "mongoose";

const loginLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  email: String,
  ip: String,
  device: String,
  location: String,
  status: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("LoginLog", loginLogSchema);