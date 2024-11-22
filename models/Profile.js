const mongoose = require('mongoose');
const profileSchema = new mongoose.Schema({
        gender:{
            type:String,
        },
        dateOfBirth:{
            type:Date,
        },
        about:{
            type:String,
        },
        contactNumber:{
            type:Number, 
        }
    })


module.exports = mongoose.model('Profile',profileSchema);