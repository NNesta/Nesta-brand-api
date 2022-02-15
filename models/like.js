import mongoose from "mongoose";
const schema = mongoose.Schema({
    articleId : {
        type:mongoose.SchemaTypes.ObjectId,
        required:true},
    userId : {
        type:mongoose.SchemaTypes.ObjectId,
        required:true},
   likeType:  {
      type: Number,
       required: true
   },
  created: {
    type: Date,
    default: () => Date.now(),
  }
 
 


});
export const Like = mongoose.model("Like",  schema);