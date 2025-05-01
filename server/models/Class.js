const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    classCode: { type: String, required: true, unique: true },
    type: { type: String, enum: ['structured', 'unstructured'], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String },
    studentIds: [{
        studentId: String,
        progress: { type: Map, of: Number },
        linkedParentEmail: String
    }],
    isPrivate: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Class', ClassSchema);
