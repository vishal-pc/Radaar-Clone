import mongoose from "mongoose";
const { Schema } = mongoose;

const adminSchema = new Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  mobile: {
    type: String,
  },
  bio: {
    type: String,
  },
  type:{
    type: String,
  },
  IsAdmin: {
    type: Boolean,
    default: false,
  },
});

const Admin = mongoose.model("admin", adminSchema);
export default Admin;
