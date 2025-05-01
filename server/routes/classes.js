const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const User = require('../models/User');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const generateClassCode = () => {
    const prefix = 'CLASS-';
    const random = Math.random().toString(36).substr(2, 8).toUpperCase();
    return `${prefix}${random}-${new Date().getFullYear()}`;
};

const generateStudentId = (index) => {
    return `STUDENT${String(index + 1).padStart(3, '0')}`;
};

// Create a Class
router.post('/create', auth, validate({
    type: { type: 'string', enum: ['structured', 'unstructured'] },
    location: { type: 'string', optional: true },
    numStudents: { type: 'number', optional: true }
}), async (req, res) => {
    const { type, location, numStudents } = req.body;
    if (req.user.role !== 'parent-teacher') return res.status(403).json({ message: 'Access denied' });

    try {
        let classCode;
        do {
            classCode = generateClassCode();
        } while (await Class.findOne({ classCode }));

        const studentIds = [];
        if (type === 'structured' && numStudents) {
            for (let i = 0; i < numStudents; i++) {
                studentIds.push({
                    studentId: generateStudentId(i),
                    progress: {},
                    linkedParentEmail: null
                });
            }
        }

        const newClass = new Class({
            classCode,
            type,
            createdBy: req.user._id,
            location: type === 'structured' ? location : undefined,
            studentIds: type === 'structured' ? studentIds : [],
            isPrivate: type === 'structured'
        });
        await newClass.save();

        req.user.createdClasses.push(newClass._id);
        await req.user.save();

        res.status(201).json({ classCode, studentIds });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Join an Unstructured Class
router.post('/join/:classCode', auth, async (req, res) => {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Access denied' });

    try {
        const classData = await Class.findOne({ classCode: req.params.classCode });
        if (!classData) return res.status(404).json({ message: 'Class not found' });
        if (classData.isPrivate) return res.status(403).json({ message: 'This class is private' });

        if (!req.user.joinedClasses.includes(classData._id)) {
            req.user.joinedClasses.push(classData._id);
            await req.user.save();
        }

        res.json({ message: 'Joined class successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
