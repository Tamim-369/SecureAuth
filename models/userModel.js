import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: "User",
  },
  verifyToken: {
    type: String,
    required: false,
  },

  verified: {
    type: Boolean,
    default: false,
  },
  verifyCode: {
    type: Number,
    required: false,
    default: null,
  },
  LogInVerified: {
    type: Boolean,
    default: false,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if the model already exists before creating a new one
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
