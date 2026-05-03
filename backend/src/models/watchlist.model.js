
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

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

module.exports = Watchlist;