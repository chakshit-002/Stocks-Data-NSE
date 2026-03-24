// src/routes/watchlist.route.js
const express = require('express');
const {
    createWatchlist,
    getAllWatchlists,
    updateWatchlist,
    deleteWatchlist
} = require('../controllers/watchlist.controller');

const router = express.Router();

// yh create a new watchlist
router.post('/watchlists', createWatchlist);

// yh vala Route to get all watchlists
router.get('/watchlists', getAllWatchlists);

//yh  update a specific watchlist by ID
router.put('/watchlists/:id', updateWatchlist);

// yh Route to delete a specific watchlist by ID
router.delete('/watchlists/:id', deleteWatchlist);

module.exports = router;