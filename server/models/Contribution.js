const mongoose = require('mongoose');

const ContributionSchema = new mongoose.Schema({
    type: { type: String, enum: ['article', 'class'], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: {
        title: String,
        body: String,
        classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }
    },
    feedback: {
        likes: { type: Number, default: 0 },
        reports: { type: Number, default: 0 },
        flagged: { type: Boolean, default: false }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contribution', ContributionSchema);
