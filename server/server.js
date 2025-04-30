const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const classRoutes = require('./routes/classes');
const profileRoutes = require('./routes/profiles');
const lessonRoutes = require('./routes/lessons');
const chatRoutes = require('./routes/chat');
const liveRoutes = require('./routes/live');
const { rateLimitMiddleware } = require('./middleware/rateLimit');
const { authenticateToken } = require('./middleware/auth');
const { MONGODB_URI, PORT } = require('./config/env');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());
app.use(rateLimitMiddleware); // Rate limiting for login attempts

// MongoDB Connection
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', authenticateToken, classRoutes);
app.use('/api/profiles', authenticateToken, profileRoutes);
app.use('/api/lessons', authenticateToken, lessonRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);
app.use('/api/live', authenticateToken, liveRoutes);

// Socket.IO for Chat
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinClass', (classId) => {
        socket.join(classId);
        console.log(`User ${socket.id} joined class ${classId}`);
    });

    socket.on('chatMessage', async (data) => {
        const { classId, senderId, message } = data;
        // Log message to chat.log
        const logMessage = `${new Date().toISOString()} - Class ${classId} - User ${senderId}: ${message}\n`;
        fs.appendFileSync(path.join(__dirname, 'logs/chat.log'), logMessage);

        // Save to MongoDB (chatMessages collection)
        const ChatMessage = mongoose.model('ChatMessage', new mongoose.Schema({
            classId: String,
            senderId: String,
            message: String,
            timestamp: { type: Date, default: Date.now }
        }));
        await new ChatMessage({ classId, senderId, message }).save();

        // Broadcast message to class
        io.to(classId).emit('message', { senderId, message, timestamp: new Date() });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start Server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
