const mongoose = require('mongoose');
require('dotenv').config();
exports.Connect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
    })
    .then(()=>console.log("DB connection Successful"))
    .catch(()=>{
        console.log("Error While Connection DB")
        process.exit(1);
    })
}