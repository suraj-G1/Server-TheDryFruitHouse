const mongoose = require('mongoose');

exports.profileSchema = ()=>{
    mongoose.Schema({
        gender:{
            type:String,
        },
        age:{
            type:Number,
        },
        about:{
            type:String,
        },
        contactNumber:{
            type:Number,
            required:true,
        }
    })
}

module.exports = mongoose.model('Profile',profileSchema);