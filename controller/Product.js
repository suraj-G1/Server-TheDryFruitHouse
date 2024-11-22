const Product = require('../models/Product');
const User = require('../models/User');
const {uploadToCloudinary} = require('../utils/uploadFileToCloudinary');
const mongoose = require('mongoose');
require('dotenv').config();

exports.addProduct = async(req,res)=>{
    try{
        
        const{productName,description,prize} = req.body; 
        const image = req.files.image;
        
        if(!productName || !description || !prize || !image){
            return res.status(400).json({
                success:false,
                message:'All Fields are required'
            })
        }
        const imageUploadResult = await uploadToCloudinary(image,process.env.FOLDER_NAME);
        const newProduct = await Product.create({
            productName,
            description,
            prize,
            image:imageUploadResult.secure_url,
        })



        const updatedUser = await User.findByIdAndUpdate(
            {_id:req.user.id},
            {$push:{
                products:newProduct._id
            }},
            {new:true}
        )

        return res.status(200).json({
            success:true,
            data:newProduct,
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while adding Product"
        })
    }
}

exports.getAllProduct = async(req,res)=>{
    try{

        const allProduct = await Product.find({
            
        });

        return res.status(200).json({
            success:true,
            data:allProduct,
            message:"All Product fetched Successfully"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while getting All Product"
        })
    }
}

exports.getProductDetails = async(req,res)=>{
    try{
        const {productId} = req.body;
        const productDetails = await Product.findOne({_id:productId})
        .populate('ratingAndReview')
        .populate('customerPurchased')
        .exec();
        if(!productDetails){
            return res.status(400).json({
                success:false,
                message:"Product does not exists"
            })
        }
        

        return res.status(200).json({
            success:true,
            message:"Product Details Fetched Successfully",
            productDetails,
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while Fetching Product Details"
        })
    }
}

exports.deleteProduct = async(req,res)=>{
    try{
        const{productId} = req.body;

        const product = await Product.findById(productId);

        if(!product){
            return res.status(400).json({
                success:false,
                message:"Product does not exists"
            })
        }

        const customerPurchased = product.customerPurchased;
        for(const userId of customerPurchased){
            await User.findByIdAndUpdate(userId,{
                $pull:{product:productId}
            })
        }

        await Product.findByIdAndDelete(productId);

        return res.status(200).json({
            success:true,
            message:"Product Deleted Successfully"
        })



    }catch(error){
        return res.status(500).json({
            success:false,
            message:'Error while deleting the Product'
        })
    }
}