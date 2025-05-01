const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    contributionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contribution', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['like', 'report'], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
