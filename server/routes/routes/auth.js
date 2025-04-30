const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { JWT_SECRET } = require('../config/env');
const router = express.Router();

// User Schema
const userSchema = new mongoose.Schema({
    role: { type: String, enum: ['student', 'teacher', 'admin', 'parent'], required: true },
    username: String, // For students
    code: String, // For students
    email: String, // For teacher/admin/parent
    password: String, // Hashed, for teacher/admin/parent
    avatar: String, // For students
    profile: Object, // Hobbies, teaching philosophy, etc.
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // For students
});
const User = mongoose.model('User', userSchema);

// Student Login
router.post('/login/student', async (req, res) => {
    const { username, code } = req.body;
    if (!username || !code) return res.status(400).json({ message: 'Username and code required' });

    const user = await User.findOne({ role: 'student', username, code });
    if (!user) return res.status(401).json({ message: 'Invalid username or code' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Teacher/Admin/Parent Login
router.post('/login/user', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email, role: { $in: ['teacher', 'admin', 'parent'] } });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Password Reset (Placeholder - Requires Email Service)
router.post('/reset-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email, role: { $in: ['teacher', 'admin', 'parent'] } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // TODO: Implement email service to send reset link (e.g., using SendGrid or Nodemailer)
    res.json({ message: 'If your email is registered, you will receive a reset link.' });
});

module.exports = router;
