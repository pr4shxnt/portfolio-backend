const express = require('express');
const Admin = require('../Models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// ✅ JWT Token Generator
const tokenGenerator = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '10h' });
};


// ✅ Email Transporter Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASS
  }
});



// ✅ Send Login Notification Email
const sendLoginNotification = async (toEmail) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: toEmail,
    subject: 'Login activity in admin panel of prashantadhikari7.com.np',
    text: 'You have logged in successfully into your admin panel of prashantadhikari7.com.np. If this was not you, please change your password immediately.',
  };

  await transporter.sendMail(mailOptions);
};

// ✅ Create Default Admin (Run on Server Start)
const createNewAdmin = async () => {
  try {
    const admins = await Admin.find();
    if (admins.length >= 1) return;

    const existingAdmin = await Admin.findOne({ username: process.env.ADMIN_USER_NAME });
    if (existingAdmin) {
      return;
    }

    const password = process.env.ADMIN_PASSWORD;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name: process.env.ADMIN_NAME,
      username: process.env.ADMIN_USER_NAME,
      password: hashedPassword,
      email: process.env.ADMIN_EMAIL,
    });

    await newAdmin.save();
    console.log("✅ Admin created successfully");
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
  }
};

// ✅ Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { cred, password } = req.body;

    const admin = await Admin.findOne({
      $or: [{ username: cred }, { email: cred }]
    });

    if (!admin) {
      return res.status(404).json({ message: 'Enter valid credentials.' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Enter valid credentials.' });
    }

    const token = tokenGenerator(admin._id);
    await sendLoginNotification(admin.email);

    res.status(200).json({
      status: 'success',
      token,
      admin: {
        name: admin.name,
        email: admin.email,
        username: admin.username
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ status: 'error 500: Error logging in', error: error.message });
  }
};

// ✅ Admin Change Password
const changePassword = async (req, res) => {
  try {
    const { token, id, oldPassword, newPassword } = req.body;

    if (!token) {
      return res.status(401).json({ status: 'error 401: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ status: 'error 401: Invalid token' });
    }

    const admin = await Admin.findById(id);
    if (!admin || decoded.id !== id) {
      return res.status(404).json({ status: 'error 404: Admin not found or token mismatch' });
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, admin.password);
    if (!isOldPasswordValid) {
      return res.status(401).json({ status: 'error 401: Invalid old password' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedNewPassword;
    await admin.save();

    res.status(200).json({ status: 'success', message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error 500: Error changing password', error: error.message });
  }
};

// ✅ Export all handlers
module.exports = {
  createNewAdmin,
  loginAdmin,
  changePassword
};
