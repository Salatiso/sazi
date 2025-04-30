const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Class Schema
const classSchema = new mongoose.Schema({
    name: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }]
});
const Class = mongoose.model('Class', classSchema);

// User Schema (for reference)
const User = mongoose.model('User');

// Get Classes for User (Teacher/Admin see their classes, Students see their enrolled classes)
router.get('/', authenticateToken, async (req, res) => {
    try {
        let classes;
        if (req.user.role === 'teacher' || req.user.role === 'admin') {
            classes = await Class.find({ teacherId: req.user.id }).populate('students', 'username avatar');
        } else if (req.user.role === 'student') {
            classes = await Class.find({ students: req.user.id }).populate('teacherId', 'profile');
        } else if (req.user.role === 'parent') {
            const child = await User.findOne({ parentId: req.user.id });
            if (!child) return res.status(404).json({ message: 'Child not found' });
            classes = await Class.find({ students: child._id }).populate('teacherId', 'profile');
        } else {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create Class (Teacher/Admin only)
router.post('/create', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Class name required' });

        const newClass = new Class({
            name,
            teacherId: req.user.id,
            students: [],
            lessons: []
        });

        await newClass.save();
        res.json(newClass);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add Student to Class (Teacher/Admin only)
router.post('/add-student', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { username, code, classId } = req.body;
        if (!username || !code || !classId) {
            return res.status(400).json({ message: 'Username, code, and classId required' });
        }

        const student = await User.findOne({ role: 'student', username, code });
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const classData = await Class.findById(classId);
        if (!classData) return res.status(404).json({ message: 'Class not found' });
        if (classData.teacherId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (classData.students.length >= 25) {
            return res.status(400).json({ message: 'Class is full (max 25 students)' });
        }

        if (classData.students.includes(student._id)) {
            return res.status(400).json({ message: 'Student already in class' });
        }

        classData.students.push(student._id);
        await classData.save();

        res.json(classData);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
