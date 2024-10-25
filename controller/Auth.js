const mongoose = require('mongoose');
const User = require('../models/User');
const otpGenerator = require('otp-generator');
const OTP = require('../models/OTP');
const bcrypt = require('bcrypt');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');
const {passwordUpdated} = require('../mailTemplate/passwordUpdate')
const mailSender = require('../utils/mailSender');
exports.sentOTP=async(req,res)=>{
    try{
        const {email} = req.body;
        
        //check whether User is already present or not
        const checkUserPresent = await User.find({email});

        if(!checkUserPresent){
            return res.status(400).json({
                success:false,
                message:"User already registered"
            })
        }

        //now generate OTP
        const otp = await otpGenerator.generate(6,{
            lowerCaseAlphabets:false,
            upperCaseAlphabets:false,
            specialChars:false,
        })

        const otpPayload = {email,otp};

        const otpBody =await OTP.create(otpPayload);

        return res.status(200).json({
            success:true,
            otp,
            message:"OTP generated Successfully"
        })
    }catch(error){
        console.log(error);
        res.status(501).json({
            success:false,
            message:error.message,
        })

    }
}

exports.signup = async(req,res)=>{
    try{
        const{
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp} = req.body;
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(400).json({
                success:false,
                message:"All fields are compulsory"
            })
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Passwords are not Matching"
            })
        }

        const checkUserPresent = await User.findOne({email});
        if(checkUserPresent){
            return res.status(400).json({
                success:false,
                message:"User is already registered"
            })
        }

        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log("Recent OTP",recentOtp);
        if(recentOtp.length === 0){
            return res.status(400).json({
                success:false,
                message:'OTP is not valid'
            })
        }

        console.log("RecentOTP",recentOtp[0].otp);
        console.log("OTP",otp);
        if(recentOtp[0].otp != otp){
            return res.status(400).json({
                success:false,
                message:"OTP are not Matching"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const profileDetails = await Profile.create({
            gender:null,
            age:null,
            about:null,
            contactNumber:null
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            
            additionalInformation:profileDetails,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}&${lastName}`
        })

        return res.status(200).json({
            success:false,
            message:"User Registered Successfully",
            user
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'User cannot be registered please try again'
        })

    }
}

exports.login=async(req,res)=>{
    try{
        const{email,password} = req.body;

        if(!email || !password){
            return res.json(400).json({
                success:false,
                message:"All fields are necessary"
            })
        }

        let user = await User.findOne({email}).populate('additionalInformation');
    
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered please SignUp"
            })
        }

        if(await bcrypt.compare(password,user.password)){
            let token = jwt.sign(
                {
                    email:user.email,
                    id:user._id,
                    accountType:user.accountType
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:"24h"
                }

            )

            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now()+ 3*24*60*60*1000),
                httpOnly:true,
            }

            res.cookie("token", token, options).status(200).json({
				success: true,
				token,
				user,
				message: `User Login Success`,
			});
        }else {
			return res.status(401).json({
				success: false,
				message: `Password is incorrect`,
			});
		}

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Error while logging in'
        })
    }
}

exports.changePassword=async(req,res)=>{
    try{
        const userId = req.user.id;
        const{oldPassword,confirmpassword,newPassword} = req.body;
        const userDetails = await User.findOne(userId);
        const isPasswordMatches = await bcrypt.compare(oldPassword,userDetails.password);
        if(!isPasswordMatches){
            return res.status(400).json({
                success:false,
                message:"Old Password is not Matching"
            })
        }

        if(confirmpassword !== newPassword){
            return res.status(400).json({
                success:false,
                message:"New Password and Confirm Password are not matching"
            })
        }

        const hashedNewPassword = await bcrypt.hash(newPassword,10);
        const updatedUser = await User.findByIdAndUpdate(
            {userId},
            {password:hashedNewPassword},
            {new:true}
        )

        try{
            const emailResponse = await mailSender(userDetails.email,passwordUpdated(
                updatedUser.email,
                `Password updated Successfully for ${updatedUser.firstName} ${updatedUser.lastName}`

            ))

            console.log(emailResponse.response);
        }catch(error){
            console.log(error.message);
            return res.status(500).json({
                success:false,
                message:'Error occured while sending mail',
                error:error.message
            })
        }

        
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'Error occured while Changing Password'
        })
    }
}