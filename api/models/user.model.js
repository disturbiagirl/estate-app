import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
},
  // timestamp adds time of creating of user and time of update of the user
  { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;



