require("dotenv").config();
const express = require("express");
const Article = require("../models/articles");
const jwt = require("jsonwebtoken");
const router = express.Router();


router.post("/login", (req,res)=>{
    const user = {email: req.body.email}
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({accessToken: accessToken});
})

function authenticateToken(req,res,next){
const authHeader = req.headers["authorization"];
const token = authHeader && authHeader.split(" ")[1];
if(authHeader == null ) return res.sendStatus(401);
jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) =>{
    if(err) return res.sendStatus(403)
    req.user = user;
    next();
});

}
module.exports = router;