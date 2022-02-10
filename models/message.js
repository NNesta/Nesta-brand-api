import mongoose from "mongoose";
const messageSchema = mongoose.Schema({
   name:{
      type:String,
    required:true,
    minlength:3
    },
   email: {
      type:String,
    required:true,
    },
   location: {longitude:Number,latitude:Number},
   message: {
      type:String,
    required:true,
    },
   created:{
      type: Date,
      default: () => Date.now(),
    },
    
   updated:{
      type: Date,
      default: () => Date.now(),
    },
    

})
export const Message = mongoose.model("message",messageSchema);