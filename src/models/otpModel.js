const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
    identify: {
        type: String,

    },
    resetPasswordOTP: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
});
const OTPModel = mongoose.model("otp", otpSchema)
module.exports = OTPModel