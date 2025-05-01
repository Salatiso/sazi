require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const classRoutes = require('./routes/classes');
const contributionRoutes = require('./routes/contributions');
const profileRoutes = require('./routes/profiles');
const lessonsRoutes = require('./routes/lessons');
const chatRoutes = require('./routes/chat');
const liveRoutes = require('./routes/live');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limit each IP to 100 requests per windowMs
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Socket.io for Chat
io.on('connection', (socket) => {
    socket.on('joinClass', (classId) => {
        socket.join(classId);
    });

    socket.on('chatMessage', (data) => {
        io.to(data.classId).emit('message', data);
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/live', liveRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
