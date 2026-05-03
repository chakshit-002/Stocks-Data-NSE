// src/routes/watchlist.route.js
const express = require('express');
const {
    createWatchlist,
    getAllWatchlists,
    updateWatchlist,
    deleteWatchlist,
    validateAndAdd
} = require('../controllers/watchlist.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

router.use(protect);
// yh create a new watchlist
router.post('/watchlists', createWatchlist);

// yh vala Route to get all watchlists
router.get('/watchlists', getAllWatchlists);

router.post('/validate-symbol',validateAndAdd);

//yh  update a specific watchlist by ID
router.put('/watchlists/:id', updateWatchlist);

// yh Route to delete a specific watchlist by ID
router.delete('/watchlists/:id', deleteWatchlist);

module.exports = router;