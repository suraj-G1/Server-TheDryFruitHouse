// Import the required modules
const express = require("express")
const router = express.Router()
const {
  capturePayment,
  // verifySignature,
  verifyPayment,
  sendPaymentSuccessEmail,
} = require("../controller/Payment")
const { auth, isCustomer,isAdmin } = require("../middlewares/auth")
router.post("/capturePayment", auth, capturePayment)
router.post("/verifyPayment", auth,  verifyPayment)
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  sendPaymentSuccessEmail
)
// router.post("/verifySignature", verifySignature)

module.exports = router