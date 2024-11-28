const { default: mongoose } = require("mongoose");
const Product = require("../models/Product");
const RatingAndReview = require("../models/RatingAndReview");
exports.createRatingAndReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, rating, review } = req.body;
        console.log("useId",userId);
        console.log("Product id",productId);


        const productDetails = await Product.findOne({
            _id: productId,
            customerPurchased: { $elemMatch: { $eq: userId } },
        });

        //customer has not purchased the product
        if (!productDetails) {
            return res.status(400).json({
            success: false,
            message: "User has not bought this product",
            });
        }

        //check whether customer has already given review or not

        const ratingGiven = await RatingAndReview.findOne({
            user: userId ,
            product: productId 
        });

        if (ratingGiven) {
            return res.status(400).json({
            success: false,
            message: "User has already given the Rating ",
            });
        }
        console.log("user hhas not given rating",review);

        //now creating rating and review
        const ratingAndReview = await RatingAndReview.create({
            user: userId,
            product: productId,
            rating,
            review,
        });

        //now update to that particular product
        await Product.findByIdAndUpdate(
            productId,
            { $push: { ratingAndReview: ratingAndReview._id } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Rating and Review given successfully",
            ratingAndReview,
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            error:error.message,
        })
    } 
};

exports.getAverageRating = async(req,res)=>{
    try{
        const{productId} = req.body;
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    product:mongoose.Schema.Types.ObjectId(productId)
                },
                
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"}
                }
            }
        ])

        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }

        return res.status(200).json({
            success:true,
            averageRating:0,
            message:'No rating given'
        })
    }catch(error){
        return res.status(400).json({
            success:false,
            message:"Error while getting Average Rating"
        })
    }
}
exports.getAllRating = async(req,res)=>{
    try{
        //const usedId = req.user.id;
        //const{productId} = req.body;
        const allReview = await RatingAndReview.find({})
                            .sort({rating:'desc'})
                            .populate({
                                path:'User',
                                select:"firstName lastName image email"
                            
                            })
                            .populate({
                                path:'Product',
                                select:'productName'
                            })
                            .exec();

        return res.status(200).json({
            success:true,
            message:'All review fetched successfully',
            data:allReview
        })

        


    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while getting Average Review"
        })
    }
}
