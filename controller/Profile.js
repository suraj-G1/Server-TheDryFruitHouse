const mongoose = require('mongoose');
const { generate } = require('otp-generator');
const User = require('../models/User');
const Profile = require('../models/Profile');
const uploadFileToCloudinary = require('../utils/uploadFileToCloudinary')
const Product = require('../models/Product');
//update the profile
exports.updateProfile = async(req,res)=>{
    try{
        const{gender,contactNumber,dateOfBirth,about=""} = req.body;
        // console.log("I am coming here to update profile",gender);
        // console.log("I am coming here to update profile",contactNumber);

        // console.log("I am coming here to update profile",dateOfBirth);

        const userId = req.user.id;
        if(!gender || !contactNumber || !dateOfBirth){
            return res.status(400).json({
                success:false,
                message:'All fields are compulsory'
            })
        }
        //find the  user from user ID
        //console.log("User id ",userId);
        const userDetails = await User.findById(userId);
        //console.log("user Details",userDetails);
        const profileId = userDetails.additionalInformation;
        //console.log("profileId",profileId);
        const profileDetails = await Profile.findById(profileId);

        //update the profile Details
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        
        //save the Profile
         await profileDetails.save();

        //return the response
        return res.status(200).json({
            success:true,
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

        const result = await uploadFileToCloudinary(displayPicture,
                                                    process.env.FOLDER_NAME,
                                                    1000,
                                                    1000
        );

        const updatedUserDetails = await User.findByIdAndUpdate(
            {id:userId},
            {image:result.secure_url},
            {new : true},
        )

        res.send({
            success: true,
            message: `Image Updated successfully`,
            data: updatedProfile,
          })
        
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while updaring the Profile Picture"
        })
    }
}


exports.getPurchasedProduct = async(req,res)=>{
    try{
        const userId = req.user.id;

        const userDetails = await User.findOne({_id:userId}).populate('products').exec();

        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User details not found"
            })
        }


        return res.status(200).json({
            success:true,
            message:'All purchased product returned successfully',
            data:userDetails.products,
        })

    }catch(error){

        return res.status(500).json({
            success: false,
            message: error.message,
          })
    }

}


exports.getAdminDashboard = async(req,res)=>{
    try{
        const userId = req.user.id;

        const adminDetails = await Product.findOne({seller:userId});

        const productData = adminDetails.map((product)=>{
            const totalCustomerPurchased = adminDetails.customerPurchased.length;
            const totalAmountGenerated = totalCustomerPurchased * product.prize;
            const productDataWithStats = {
                _id:product._id,
                productName:product.name,
                productDescription:product.description,
                totalCustomerPurchased,
                totalAmountGenerated,
            }

            return  productDataWithStats

        })

        return res.status(200).json({
            data:productData,
        })


    }catch(error){

        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })

    }
}