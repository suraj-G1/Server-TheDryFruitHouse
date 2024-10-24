const mongoose = require('mongoose');


exports.ratingAndReviewSchema = ()=>{
    mongoose.Schema({
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        },
        rating:{
            type:Number,
            required:true,
        },
        review:{
            type:String,
            required:true,
        }
    })
}

module.exports = mongoose.Schema("RatingAndReview",ratingAndReviewSchema);