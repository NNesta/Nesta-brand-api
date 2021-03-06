
import mongoose from "mongoose";
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 4,
    maxlenth: 20,
  },
  secondName: {
    type: String,
    required: true,
    minlength: 3,
    maxlenth: 20,
  },
  email: {
    type: String,
    required: true,
    minlength: 4,
    maxlength:50,
    unique: true,
  },
  location: { longitude: Number, latitude: Number },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlenth: 20,
  },
  created: {
    type: Date,
    default: () => Date.now(),
  },

  updated: {
    type: Date,
    default: () => Date.now(),
  },
  userStatus: {                                 //This show the status of the user
    type: Number,                               // 0 => This user can view the article comment and send message
    min: 1,                                     // 1 => This user can create the article, update it and delete it in addition to what user 0 can do
    max: 3,                                     // 2 => This is super user he give status to whoever user, can CRUD to user, article and message model
    required: true,
    default: 0 
  }
});

export const User = mongoose.model("User", userSchema);
