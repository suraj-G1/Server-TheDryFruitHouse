const mongoose = require('mongoose');
const { generate } = require('otp-generator');
const User = require('../models/User');
const Profile = require('../models/Profile');

//update the profile
exports.updateProfile = async(req,res)=>{
    try{
        const{gender,contactNumber,age,about=""} = req.body;
        const userId = req.user.id;
        if(!gender || !contactNumber || !age){
            return res.status(400).json({
                success:false,
                message:'All fields are compulsory'
            })
        }

        //find the  user from user ID
        const userDetails = await User.findById(userId);
        const profileId = userDetails.additionalInformation;
        const profileDetails = await Profile.findById(profileId);

        //update the profile Details
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        profileDetails.age = age;
        profileDetails.about = about;
        
        //save the Profile
        profileDetails.save();

        //return the response
        return res.status(400).json({
            success:false,
            message:'Profile Details Updated Successfully',
            profileDetails
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while updating the Profile Details"
        })
    }
}

// delete the profile
exports.deleteProfile = async(req,res)=>{
    try{
        //extract user details from userId 
        const userId = req.user.id;
        const userDetails = await User.findById(userId);

        //if user does not exist
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:'User does not exists'
            })
        }

        //delete the profile
        const profileId = userDetails.additionalInformation;
        await Profile.findByIdAndDelete(profileId);

        //delete the user
        await User.findByIdAndDelete(userId);

    }catch(error){
        return res.status(500).json({
            success:false,
            message:'Error while deleting the account'
        })
    }
}

//get all user information
exports.getAllUserDetails = async(req,res)=>{
    try{
        const userId = req.user.id;

        const userDetails = await User.findById(userId)
                            .populate('additionalInformation')
                            .exec();

        console.log(userDetails);

        return res.status(200).json({
            success:true,
            messsage:"User Details fetched successfully",
            userDetails
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'Error while getting all users'
        })
    }
}

//update display picture
exports.updateProfilePicture = async(req,res)=>{
    try{
        const displayPicture = req.files.displayPicture;
        const userId = req.user.id;
        
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while updaring the Profile Picture"
        })
    }
}