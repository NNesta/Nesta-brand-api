import mongoose from "mongoose";
const schema = mongoose.Schema({
  title: {
  type:String,
  required:true,
  minlength:4,
  maxlength:50,
   text: true
  },
  author: {
    type:Object,
  required:true,
  minlength:4,
  maxlength:30
  },
  picture: {
    type:String,
  required:true,
  minlength:4
  },
  cloudinary_id:{
    type:String,
    required: false
  },
  articleDetail: {
    required:true,
  minlength:4,
  maxlength:10000,
   text: true
  },
  tag: {
    type:String,
  required:true,
  minlength:4,
  maxlength:20,
  text: true
  },
  created: {
    type: Date,
    default: () => Date.now(),
  },
  updated: {
    type: Date,
    default: () => Date.now(),
  }
});
export const Article = mongoose.model("Article",  schema);
// module.exports = Article;
