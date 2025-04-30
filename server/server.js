const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = require('./config/db');
connectDB();

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['teacher', 'admin', 'parent'], required: true },
    classIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }]
});

const studentSchema = new mongoose.Schema({
    username: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    role: { type: String, default: 'student' },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const User = mongoose.model('User', userSchema);
const Student = mongoose.model('Student', studentSchema);

// Authentication Routes
app.post('/api/login/student', async (req, res) => {
    const { username, code } = req.body;
    const student = await Student.findOne({ username, code });
    if (!student) {
        return res.status(401).json({ message: 'Invalid username or code' });
    }
    const token = jwt.sign({ id: student._id, role: student.role }, 'secret', { expiresIn: '1h' });
    res.json({ token });
});

app.post('/api/login/user', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, 'secret', { expiresIn: '1h' });
    res.json({ token });
});

app.post('/api/reset-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ message: 'If your email is registered, you will receive a reset link.' });
    }
    // In a real implementation, send an email with a reset link (mocked here)
    res.json({ message: 'If your email is registered, you will receive a reset link.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
