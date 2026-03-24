
const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Watchlist ka naam unique rahega
        trim: true,
    },
    symbols: [{
        type: String,
        required: true,
        trim: true,
    }],
}, {
    timestamps: true,
});

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

module.exports = Watchlist;