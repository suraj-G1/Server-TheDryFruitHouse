const express = require('express');
const router = express.Router();

const{
    updateProfile,
    deleteProfile,
    getPurchasedProduct,
    getAllUserDetails,
    getAdminDashboard,
    updateProfilePicture,
} = require('../controller/Profile');

const {auth,isAdmin,isCustomer} = require('../middlewares/auth');

router.delete('/deleteProfile',auth,deleteProfile);
router.put('/updateProfile',auth,updateProfile);
router.get('/getPurchasedProduct',auth,getPurchasedProduct);
router.get('/getAllUserDetails',auth,isCustomer,getAllUserDetails);
router.get('/getAdminDashboard',auth,isAdmin,getAdminDashboard);
router.get('/updateProfilePicture',auth,updateProfilePicture);

module.exports = router;