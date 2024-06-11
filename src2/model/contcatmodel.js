const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const  Schhema=new mongoose.Schema({
    Name:{
        type:String,
    },
    Email:{
        type:String,

    },
    Message:{
        type:String,
    },


});
const Contactt= new mongoose.model("Contactt",Schhema);
module.exports=Contactt;