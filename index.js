const express = require("express");
require('dotenv').config();
const database = require('./config/database');
const app = express();
const PORT = process.env.PORT || 4000

database.Connect();
app.get('/',(req,res)=>{
    return res.json({
        success:true,
        message:"Hello World"
    })
})

app.listen(PORT,()=>{
    console.log(`App is running on ${PORT}`);
})