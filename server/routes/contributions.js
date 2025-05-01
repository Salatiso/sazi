const express = require('express');
const router = express.Router();
const Contribution = require('../models/Contribution');
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

// Submit a Contribution
router.post('/submit', auth, validate({
    type: { type: 'string', enum: ['article', 'class'] },
    content: { type: 'object' }
}), async (req, res) => {
    const { type, content } = req.body;
    try {
        const contribution = new Contribution({
            type,
            createdBy: req.user._id,
            content
        });
        await contribution.save();

        req.user.contributions.push(contribution._id);
        await req.user.save();

        res.status(201).json({ message: 'Contribution submitted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Provide Feedback (Like/Report)
router.post('/feedback/:contributionId', auth, validate({
    type: { type: 'string', enum: ['like', 'report'] }
}), async (req, res) => {
    const { type } = req.body;
    const { contributionId } = req.params;
    try {
        const contribution = await Contribution.findById(contributionId);
        if (!contribution) return res.status(404).json({ message: 'Contribution not found' });

        const existingFeedback = await Feedback.findOne({ contributionId, userId: req.user._id, type });
        if (existingFeedback) return res.status(400).json({ message: `You have already ${type}d this contribution` });

        const feedback = new Feedback({ contributionId, userId: req.user._id, type });
        await feedback.save();

        if (type === 'like') {
            contribution.feedback.likes += 1;
        } else {
            contribution.feedback.reports += 1;
            if (contribution.feedback.reports >= 5) {
                contribution.feedback.flagged = true;
            }
        }
        await contribution.save();

        res.json({ message: `${type} recorded` });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Vote to Remove Flagged Content (Teachers only)
router.post('/vote-remove/:contributionId', auth, async (req, res) => {
    if (req.user.role !== 'parent-teacher') return res.status(403).json({ message: 'Access denied' });

    try {
        const contribution = await Contribution.findById(req.params.contributionId);
        if (!contribution) return res.status(404).json({ message: 'Contribution not found' });
        if (!contribution.feedback.flagged) return res.status(400).json({ message: 'Content not flagged' });

        contribution.feedback.reports += 1;
        if (contribution.feedback.reports >= 8) { // 3 votes after 5 reports
            await Contribution.deleteOne({ _id: contribution._id });
            res.json({ message: 'Content removed' });
        } else {
            await contribution.save();
            res.json({ message: 'Vote recorded' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
