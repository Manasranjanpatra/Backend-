const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Schema = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true

    },
    confirmpassword: {
        type: String,
        required: true,
        unique: true

    },
    tokens: [{
        token: {
            type: String,
            required: true

        }
    }]
})
const  Schhema=new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:Number,

    },
    message:{
        type:String,
    },


});


Schema.methods.generateAuth = async function (req, tes) {
    try {
        console.log(this._id)
        const token = jwt.sign({ _id: this._id.toString() }, "jnnjnmdojnababajnjjjjnsuajqndjuhunajzwefj");
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        console.log(`the token is${token}`);
        return token;/// as you called the function you must be retrun something 

    } catch (e) {
        console.log(e);

    }



}

Schema.pre("save", async function (next) {
    if (this.isModified("password")) {

        this.password = await bcrypt.hash(this.password, 10);
        console.log(this.password);
    }
    next();

});


const Collection = new mongoose.model("Collection", Schema);
const Contact= new mongoose.model("Contact",Schhema);


module.exports = Collection;
// module.exports = Contact;