const mongoose = require('mongoose');

exports.userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    additionalInformation:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile"
    },
    accountType:{
        type:String,
        enum:["Admin","Customer"],
        required:true,
    },
    image:{
        type:String,
    },
    token:{
        type:String,
    },
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }
    ]
});

module.exports = mongoose.model("User",userSchema);