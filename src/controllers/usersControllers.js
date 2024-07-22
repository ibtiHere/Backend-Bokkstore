const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usersModel = require("../models/usersModel");
const OTPModel = require("../models/otpModel.js");
const transporter = require("../middleware/nodemailer.js");
const generateOTP = require("../utils/otp.js");


// Signup endpoint
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await usersModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new usersModel({
            name,
            email,
            password: hashedPassword
        });
        await user.save();

        // Generate JWT token
        const token = jwt.sign({
            userId: user._id, email: user.email,
        }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.status(201).json({ message: "User created successfully", user, token });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ message: "Error signing up", error });
    }
};

// Login endpoint
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await usersModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign({
            userId: user._id, email: user.email
        }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.status(200).json({ message: "Login successful", user, token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: "Error logging in", error });
    }
};


// Forget Password endpoint
exports.forgetpassword = async (req, res) => {
    const { email } = req.body;
    try {
        // Find user by email
        const user = await usersModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Generate OTP and set expiration time (e.g., 1 hour from now)
        const otp = generateOTP();
        const otpExpires = Date.now() + 3600000; // 1 hour in milliseconds

        // Save OTP to database
        const otps = new OTPModel({
            identify: user.email,
            resetPasswordOTP: otp,
            resetPasswordExpires: otpExpires,
        });
        await otps.save();

        // Send OTP via email
        const mailOptions = {
            from: "ibtasamofficial@gmail.com",
            to: email,
            subject: 'Your Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`
        };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
        console.error('Error in forget password:', error);
        res.status(500).json({ message: "Error in forget password", error });
    }
};

// Verify OTP endpoint
exports.verifyotp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        // Find user by email and verify OTP
        const user = await OTPModel.findOne({
            identify: email,
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() }, // Check if OTP is still valid
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid OTP or OTP has expired" });
        }

        // Clear OTP fields (optional: if OTP verification is successful, you might want to clear OTP fields immediately)
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error('Error in verifying OTP:', error);
        res.status(500).json({ message: "Error in verifying OTP", error });
    }
};

// Reset Password endpoint
exports.resetPassword = async (req, res) => {
    const { email, newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        // Find user by email
        const user = await usersModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error('Error in resetting password:', error);
        res.status(500).json({ message: "Error in resetting password", error });
    }
};
