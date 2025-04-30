const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

module.exports = mongoose;
