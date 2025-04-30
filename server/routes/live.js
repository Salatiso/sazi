const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Live Session Schema
const liveSessionSchema = new mongoose.Schema({
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jitsiRoomId: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: Date
});
const LiveSession = mongoose.model('LiveSession', liveSessionSchema);

// Class Schema (for reference)
const Class = mongoose.model('Class');

// Start Live Class (Teacher only)
router.post('/start', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { classId } = req.body;
        if (!classId) return res.status(400).json({ message: 'Class ID required' });

        const classData = await Class.findById(classId);
        if (!classData) return res.status(404).json({ message: 'Class not found' });
        if (classData.teacherId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const jitsiRoomId = `SaziClassRoom_${classId}_${Date.now()}`; // Unique room ID
        const liveSession = new LiveSession({
            classId,
            teacherId: req.user.id,
            jitsiRoomId,
            startTime: new Date()
        });

        await liveSession.save();
        res.json({ jitsiRoomId });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Active Live Session for Class
router.get('/:classId', authenticateToken, async (req, res) => {
    try {
        const classId = req.params.classId;
        const classData = await Class.findById(classId);
        if (!classData) return res.status(404).json({ message: 'Class not found' });

        // Check user access
        let hasAccess = false;
        if (req.user.role === 'teacher' || req.user.role === 'admin') {
            hasAccess = classData.teacherId.toString() === req.user.id;
        } else if (req.user.role === 'student') {
            hasAccess = classData.students.includes(req.user.id);
        } else if (req.user.role === 'parent') {
            const child = await mongoose.model('User').findOne({ parentId: req.user.id });
            hasAccess = child && classData.students.includes(child._id);
            // TODO: Implement rotational schedule for parents (5 per day)
        }

        if (!hasAccess) return res.status(403).json({ message: 'Unauthorized' });

        const liveSession = await LiveSession.findOne({ 
            classId, 
            endTime: { $exists: false }
        });
        if (!liveSession) return res.status(404).json({ message: 'No active live session' });

        res.json({ jitsiRoomId: liveSession.jitsiRoomId });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
