const jwt =require('jsonwebtoken');
const Collection= require("../model/models");





const auth=async(req,res,next)=>{
    try{
        const token =req.cookies.jwt;
        console.log(`th auth key is ${token} `);
    const verify =jwt.verify(token,"jnnjnmdojnababajnjjjjnsuajqndjuhunajzwefj");
    const user=await Collection.findOne({_id:verify._id});
    console.log(user);
    req.user =user;

    }catch(e){
      console.log(e);
      res.status(401).send(e);
    }
    next();
}
module.exports =auth;