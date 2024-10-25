const mongoose = require('mongoose');
const profileSchema = new mongoose.Schema({
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
            
        }
    })


module.exports = mongoose.model('Profile',profileSchema);