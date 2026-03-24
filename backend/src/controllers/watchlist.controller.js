// // src/controllers/watchlist.controller.js
// const Watchlist = require('../models/watchlist.model');

// // Controller for creating a new watchlist
// exports.createWatchlist = async (req, res) => {
//     const { name, symbols } = req.body;

//     if (!name || !symbols || !Array.isArray(symbols) || symbols.length === 0) {
//         return res.status(400).json({ error: 'Watchlist name and at least one stock symbol are required.' });
//     }

//     try {
//         const newWatchlist = await Watchlist.create({ name, symbols });
//         res.status(201).json(newWatchlist);
//     } catch (err) {
//         if (err.code === 11000) {
//             return res.status(409).json({ error: 'A watchlist with this name already exists.' });
//         }
//         console.error('Error creating watchlist:', err.message);
//         res.status(500).json({ error: 'Failed to create watchlist.' });
//     }
// };

// // Controller for getting all watchlists
// exports.getAllWatchlists = async (req, res) => {
//     try {
//         const watchlists = await Watchlist.find({});
//         res.json(watchlists);
//     } catch (err) {
//         console.error('Error fetching watchlists:', err.message);
//         res.status(500).json({ error: 'Failed to retrieve watchlists.' });
//     }
// };

// // Controller for updating a watchlist (adding/removing stocks)
// exports.updateWatchlist = async (req, res) => {
//     const { id } = req.params;
//     const { symbols } = req.body;

//     if (!symbols || !Array.isArray(symbols)) {
//         return res.status(400).json({ error: 'An array of stock symbols is required for update.' });
//     }

//     try {
//         const updatedWatchlist = await Watchlist.findByIdAndUpdate(
//             id,
//             { $set: { symbols: symbols.map(s => s.toUpperCase().trim()) } },
//             { new: true, runValidators: true }
//         );

//         if (!updatedWatchlist) {
//             return res.status(404).json({ error: 'Watchlist not found.' });
//         }
//         res.json(updatedWatchlist);
//     } catch (err) {
//         console.error('Error updating watchlist:', err.message);
//         res.status(500).json({ error: 'Failed to update watchlist.' });
//     }
// };

// // Controller for deleting a watchlist
// exports.deleteWatchlist = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const result = await Watchlist.findByIdAndDelete(id);
//         if (!result) {
//             return res.status(404).json({ error: 'Watchlist not found.' });
//         }
//         res.status(200).json({ message: 'Watchlist deleted successfully.' });
//     } catch (err) {
//         console.error('Error deleting watchlist:', err.message);
//         res.status(500).json({ error: 'Failed to delete watchlist.' });
//     }
// };





const Watchlist = require('../models/watchlist.model');

// Create a new watchlist
exports.createWatchlist = async (req, res) => {
    try {
        const { name, symbols } = req.body;

        // Basic Validation
        if (!name || !symbols || !Array.isArray(symbols)) {
            return res.status(400).json({ error: 'Name and symbols array are required.' });
        }

        // Clean up symbols: Trim, UpperCase, and remove empty values
        const cleanSymbols = symbols
            .map(s => (s ? s.toString().toUpperCase().trim() : ''))
            .filter(s => s.length > 0);

        if (cleanSymbols.length === 0) {
            return res.status(400).json({ error: 'Watchlist must contain at least one valid symbol.' });
        }

        const newWatchlist = await Watchlist.create({ 
            name: name.trim(), 
            symbols: cleanSymbols 
        });

        res.status(201).json(newWatchlist);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'A watchlist with this name already exists.' });
        }
        console.error('Error creating watchlist:', err.message);
        res.status(500).json({ error: 'Server Error: Failed to create watchlist.' });
    }
};

// Get all watchlists
exports.getAllWatchlists = async (req, res) => {
    try {
        const watchlists = await Watchlist.find({}).sort({ createdAt: -1 });
        res.status(200).json(watchlists || []);
    } catch (err) {
        console.error('Error fetching watchlists:', err.message);
        res.status(500).json({ error: 'Server Error: Failed to retrieve watchlists.' });
    }
};

// Update a watchlist
exports.updateWatchlist = async (req, res) => {
    try {
        const { id } = req.params;
        const { symbols } = req.body;

        if (!symbols || !Array.isArray(symbols)) {
            return res.status(400).json({ error: 'Symbols array is required for update.' });
        }

        const cleanSymbols = symbols
            .map(s => (s ? s.toString().toUpperCase().trim() : ''))
            .filter(s => s.length > 0);

        const updatedWatchlist = await Watchlist.findByIdAndUpdate(
            id,
            { $set: { symbols: cleanSymbols } },
            { new: true, runValidators: true }
        );

        if (!updatedWatchlist) {
            return res.status(404).json({ error: 'Watchlist not found.' });
        }

        res.status(200).json(updatedWatchlist);
    } catch (err) {
        console.error('Error updating watchlist:', err.message);
        res.status(500).json({ error: 'Server Error: Failed to update watchlist.' });
    }
};

// Delete a watchlist
exports.deleteWatchlist = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Watchlist.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ error: 'Watchlist not found.' });
        }

        res.status(200).json({ message: 'Watchlist deleted successfully.' });
    } catch (err) {
        console.error('Error deleting watchlist:', err.message);
        res.status(500).json({ error: 'Server Error: Failed to delete watchlist.' });
    }
};