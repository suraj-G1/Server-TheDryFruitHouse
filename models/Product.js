const mongoose = require('mongoose');

exports.productSchema = ()=>{
    mongoose.Schema({
        name:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        prize:{
            type:Number,
            required:true,
        },
        image:{
            type:String,
            required:true,
        },
        ratingAndReview:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"RatingAndReview"
            }
        ]
    })
}

module.exports = mongoose.model('Product',productSchema);