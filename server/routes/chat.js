const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Chat Message Schema
const chatMessageSchema = new mongoose.Schema({
    classId: { type: String, required: true },
    senderId: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});
const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

// Class Schema (for reference)
const Class = mongoose.model('Class');

// Get Chat Messages for a Class
router.get('/:classId', authenticateToken, async (req, res) => {
    try {
        const classId = req.params.classId;
        const classData = await Class.findById(classId);
        if (!classData) return res.status(404).json({ message: 'Class not found' });

        // Check user access (teacher, student, or parent of student in class)
        let hasAccess = false;
        if (req.user.role === 'teacher' || req.user.role === 'admin') {
            hasAccess = classData.teacherId.toString() === req.user.id;
        } else if (req.user.role === 'student') {
            hasAccess = classData.students.includes(req.user.id);
        } else if (req.user.role === 'parent') {
            const child = await mongoose.model('User').findOne({ parentId: req.user.id });
            hasAccess = child && classData.students.includes(child._id);
        }

        if (!hasAccess) return res.status(403).json({ message: 'Unauthorized' });

        const messages = await ChatMessage.find({ classId }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
