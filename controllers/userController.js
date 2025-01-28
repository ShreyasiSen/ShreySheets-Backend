import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Handling registration
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

   
};
const register = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body;

    // Validation logic
    if (!username || !password || !email) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    // Check if user already exists
    const userExists = await User.findOne({ emailId: email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        userName: username,
        emailId: email,
        password: hashedPassword,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.userName,
            email: user.emailId,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});


//login functionality 
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validation logic
    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    // Check if user exists
    const user = await User.findOne({ emailId: email });

    if (!user) {
        res.status(400);
        throw new Error('Invalid credentials');
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        res.status(400);
        throw new Error('Invalid credentials');
    }
    //generate token

    const token=generateToken(user._id);
    //set the cookie 
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
    });
    res.json({
        _id: user._id,
        username: user.userName,
        email: user.emailId,
        token,
       
    });
});
//logout functionality 
const logout = asyncHandler(async (req, res) => { 
    res.clearCookie('token', { path: '/' });
    res.status(200).json({
        message: 'Logged out successfully',
    });
});
//user profile 

const profile = asyncHandler(async (req, res) => {
    // Access the authenticated user's information
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Extract the first name from the username
    const firstName = user.userName.split(' ')[0];

    res.json({
        _id: user._id,
        username: user.userName,
        email: user.emailId,
    });
});
//chedk user auth status
const checkAuth= asyncHandler(async (req, res) => {
    const decoded=jwt.verify(req.cookies.token,process.env.JWT_SECRET);
    if(decoded)
    {
        res.json({message:'User is authenticated'});
    }
    else
    {
        res.status(401);
        throw new Error('User is not authenticated');
    }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ emailId: email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

  const message = `
    <h1>You have requested a password reset</h1>
    <p>Please go to this link to reset your password:</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.emailId,
      subject: 'Password Reset Request',
      html: message,
    });

    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    console.error('Error sending email:', error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500);
    throw new Error('Email could not be sent');
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid token');
  }

  if (!req.body.password) {
    res.status(400);
    throw new Error('Password is required');
  }

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
});

//exporting the functions

export  { register, login ,logout ,profile ,checkAuth, forgotPassword, resetPassword };