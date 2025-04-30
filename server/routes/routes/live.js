const express = require('express');
const router = express.Router();

// Placeholder for live class routes
router.get('/', (req, res) => {
    res.json({ message: 'Live class API' });
});

module.exports = router;
