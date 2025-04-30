const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// User Schema (assuming it's defined in auth.js and accessible)
const userSchema = new mongoose.Schema({
    role: { type: String, enum: ['student', 'teacher', 'admin', 'parent'], required: true },
    username: String,
    code: String,
    email: String,
    password: String,
    avatar: String,
    profile: Object,
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const User = mongoose.model('User', userSchema);

// Get User Profile
router.get('/', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Avatar (for students)
router.post('/update-avatar', authenticateToken, async (req, res) => {
    try {
        const { avatar } = req.body;
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can update avatars' });
        }

        // Validate avatar (ensure it's one of the allowed options)
        const allowedAvatars = [
            'umngqusho.jpg', 'beaded_necklace.jpg', 'inyanga.jpg', 'goat.jpg',
            'kente_cloth.jpg', 'baobab_tree.jpg', 'springbok.jpg', 'lion.jpg',
            'elephant.jpg', 'leopard.jpg', 'rhino.jpg', 'buffalo.jpg', 'meerkat.jpg',
            'sangoma_staff.jpg', 'ancestral_mask.jpg', 'tokoloshe.jpg'
        ];
        if (!allowedAvatars.includes(avatar)) {
            return res.status(400).json({ message: 'Invalid avatar selection' });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { avatar },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Profile Details (e.g., hobbies, teaching philosophy)
router.put('/update', authenticateToken, async (req, res) => {
    try {
        const { profile } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profile },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
