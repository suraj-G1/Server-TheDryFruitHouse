const express = require('express');
const router = express.Router();

const {
    login,
    signup,
    sentOTP,
    changePassword 
} = require('../controller/Auth');

const{auth} = require('../middlewares/auth');

router.post('/login',login);
router.post('/signup',signup);
router.post('/sendOTP',sentOTP);
router.post('/changePassword',auth,changePassword);
module.exports = router;

