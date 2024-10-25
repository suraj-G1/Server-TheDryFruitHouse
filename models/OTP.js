const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const emailVerification = require('../mailTemplate/emailVerification');
const otpSchema = new mongoose.Schema({
        otp:{
            type:Number,
            required:true,
        },
        email:{
            type:String,
            required:true,
        },
        createdAt:{
            type:Date,
            default:Date.now(),
            expires:5*60*1000,
        }
    })


async function sendVerificationEmail(email,otp){
    try{
        const result = await mailSender(email,"Verification Mail from Royal FruitNuts",emailVerification(otp))
        console.log("OTP verification Result",result);
    }catch(error){
        console.log("Errow while Sending verification Email");
        throw error;
    }
}
otpSchema.pre('save',async function(next){
    if(this.isNew){
        await sendVerificationEmail(this.email,this.otp);
    }
    next();
})

module.exports = mongoose.model("OTP",otpSchema);