import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
  },
  bio: {
    type: String,
  },
  IsprofileComplete: {
    type: Boolean,
    default: false,
  },
  isOnline: {
    type: Boolean,
    default: true,
  },
  address: {
    type: String,
  },
  is_user_active: {
    type: Boolean,
    default: true,
  },
});

const User = mongoose.model("user", userSchema);

export default User;
