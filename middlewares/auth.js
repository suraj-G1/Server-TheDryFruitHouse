const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

//middleware to Authenticate the user
exports.auth=async(req,res,next)=>{
    try{
        const {productId} = req.body;
        console.log("Pringting Product ID",productId);
        const token = req.body.token ||
                    req.cookies.token || 
                    req.header('Authorization').replace("Bearer ","");
    
        console.log("token",token);
        //if token is not present then return 
        if(!token){
            return res.status(400).json({
                success:false,
                message:"Token is Missing"
            })
        
        }

        //verify the token

        try{

            const decode = await jwt.verify(token,process.env.JWT_SECRET);
            console.log('Decode',decode);
            req.user = decode;
        }catch(error){
            return res.status(401).json({
                success:false,
                message:'Token is invalid'
            })

        }
        console.log("Token is valid");
        next();

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while validating the token'
        })
    }
}

//middleware to check user is Customer or not
exports.isCustomer = async(req,res,next)=>{
    try{
        if(req.user.accountType !== 'Customer'){
            return res.status(400).json({
                sucess:false,
                message:'This is protected route for Customer'
            })
        }
        next();
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error while checking user is Customer or not"
        })
    }
}

//middleware to check user is Admin or not
exports.isAdmin=async(req,res,next)=>{
    try{
        console.log('User',req.user.email);
        console.log("Admin ",process.env.ADMIN_EMAIL);
        if(req.user.email !== process.env.ADMIN_EMAIL){
            return res.status(400).json({
                success:false,
                message:"This is protected route for Admin"
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while checking User is Admin"
        })
    }
}