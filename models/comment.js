import mongoose from "mongoose";
const schema = mongoose.Schema({
    articleId : {
        type:String,
        required:true},
    userId : {
        type:String,
        required:true},
    commentor: {
      type: String,
      required: true
    },
   comment:  {
       type: String,
       required: true
   },
  created: {
    type: Date,
    default: () => Date.now(),
  }

});
export const Comment = mongoose.model("Comment",  schema);