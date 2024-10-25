const express = require("express");
require('dotenv').config();
const database = require('./config/database');
const app = express();
const PORT = process.env.PORT || 4000
const {cloudinaryConnect} = require('./config/cloudinary');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload')
const userRoutes = require('./routes/User');
const profileRoutes = require('./routes/Profile');
const productRoutes = require('./routes/Product');
database.Connect();
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin:"http://localhost:3000",
		credentials:true,
	})
)

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)

cloudinaryConnect();


app.use('/api/v1/auth',userRoutes);
app.use('/api/v1/profile',profileRoutes);
app.use('/api/v1/product',productRoutes);

app.get('/',(req,res)=>{
    return res.json({
        success:true,
        message:"Hello World"
    })
})

app.listen(PORT,()=>{
    console.log(`App is running on ${PORT}`);
})