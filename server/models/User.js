const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['parent-teacher', 'student'], required: true },
    contributions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contribution' }],
    createdClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    joinedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    customCurriculum: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
