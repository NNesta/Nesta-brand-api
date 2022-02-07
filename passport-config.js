import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import {User} from "./models/user.js";
import passport from "passport";

passport.serializeUser((user,done)=>{done(null,user)})
passport.deserializeUser((user,done)=>{done(null,user)})

passport.use(new LocalStrategy.Strategy({usernameField:"email"},
    async (email,password, done)=>{
     const userFound = await User.findOne({"email":email})
     if(userFound == null){
        return done(null, false, {message:"No user with that email"})
    }
    try{
       if(await bcrypt.compare(password,userFound.password)){
           return done(null, userFound);
       }else{
           return done(null, false, {message: "Incorrect password"})
       }
    }
    catch(err){
       return done(err);
    }
  
}))

