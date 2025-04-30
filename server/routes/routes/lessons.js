const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Lesson Schema
const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: Object, // Video URL, audio URL, quiz questions
    ageGroup: { type: String, enum: ['4-7', '8-15', 'adult'], required: true },
    topic: { type: String, required: true },
    progress: [{
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        completion: { type: Number, default: 0 }, // Percentage
        score: { type: Number, default: 0 }, // Points earned
        badges: [String] // E.g., "Vocabulary Master"
    }]
});
const Lesson = mongoose.model('Lesson', lessonSchema);

// Class Schema (for reference)
const Class = mongoose.model('Class');

// Get Lessons for User (Students see assigned lessons, Teachers see all lessons)
router.get('/', authenticateToken, async (req, res) => {
    try {
        if (req.user.role === 'student') {
            const classes = await Class.find({ students: req.user.id });
            const classIds = classes.map(c => c._id);
            const lessons = await Lesson.find({ 
                _id: { $in: classes.flatMap(c => c.lessons) }
            });
            res.json(lessons.map(lesson => ({
                ...lesson._doc,
                progress: lesson.progress.find(p => p.studentId.toString() === req.user.id) || { completion: 0, score: 0, badges: [] }
            })));
        } else if (req.user.role === 'teacher' || req.user.role === 'admin') {
            const lessons = await Lesson.find();
            res.json(lessons);
        } else {
            return res.status(403).json({ message: 'Unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Assign Lesson to Class (Teacher only)
router.post('/assign', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { lessonId, classId } = req.body;
        if (!lessonId || !classId) {
            return res.status(400).json({ message: 'Lesson ID and Class ID required' });
        }

        const lesson = await Lesson.findById(lessonId);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

        const classData = await Class.findById(classId);
        if (!classData) return res.status(404).json({ message: 'Class not found' });
        if (classData.teacherId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (!classData.lessons.includes(lessonId)) {
            classData.lessons.push(lessonId);
            await classData.save();
        }

        // Initialize progress for each student in the class
        for (const studentId of classData.students) {
            if (!lesson.progress.some(p => p.studentId.toString() === studentId.toString())) {
                lesson.progress.push({ studentId, completion: 0, score: 0, badges: [] });
            }
        }
        await lesson.save();

        res.json(classData);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
