const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Class = require('../models/Class');
const validate = require('../middleware/validate');
const { body } = require('express-validator');

const generateClassCode = () => {
    const prefix = 'CLASS-';
    const random = Math.random().toString(36).substr(2, 8).toUpperCase();
    return `${prefix}${random}-${new Date().getFullYear()}`;
};

const generateStudentId = (index) => {
    return `STUDENT${String(index + 1).padStart(3, '0')}`;
};

// Register Parent/Teacher
router.post('/register/parent-teacher', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], validate({
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 8 }
}), async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'Email already exists' });

        user = new User({
            email,
            password: await bcrypt.hash(password, 10),
            role: 'parent-teacher'
        });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Register Student (Self-Registered)
router.post('/register/student', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], validate({
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 8 }
}), async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'Email already exists' });

        user = new User({
            email,
            password: await bcrypt.hash(password, 10),
            role: 'student'
        });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Parent/Teacher
router.post('/login/user', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        if (user.role !== 'parent-teacher') return res.status(403).json({ message: 'Access denied' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Student (Structured)
router.post('/login/student', async (req, res) => {
    const { classCode, studentId } = req.body;
    try {
        const classData = await Class.findOne({ classCode });
        if (!classData) return res.status(400).json({ message: 'Invalid class code' });

        const student = classData.studentIds.find(s => s.studentId === studentId);
        if (!student) return res.status(400).json({ message: 'Invalid student ID' });

        const user = await User.findOne({ email: classCode + '-' + studentId + '@sazi.life' });
        if (!user) {
            const newUser = new User({
                email: classCode + '-' + studentId + '@sazi.life',
                password: await bcrypt.hash(classCode + studentId, 10),
                role: 'student',
                joinedClasses: [classData._id]
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.json({ token });
        } else {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.json({ token });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
