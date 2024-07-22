const express = require("express");
const router = express.Router();
const {
    signup,
    login,
    verifyotp,
    resetPassword,
    forgetpassword
} = require("../controllers/usersControllers.js");






router.post("/signup", signup);
router.post("/login", login);
router.post("/forgetpassword", forgetpassword);
router.post("/verifyotp", verifyotp);
router.post("/resetPassword", resetPassword);






module.exports = router