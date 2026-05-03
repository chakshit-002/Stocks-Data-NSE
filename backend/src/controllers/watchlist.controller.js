const Watchlist = require('../models/watchlist.model');
const SymbolMaster = require('../models/symbolMaster.model');

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

        for (let s of symbols) {
            const isMasterValid = await SymbolMaster.findOne({ symbol: s.toUpperCase() });
            if (!isMasterValid) {
                return res.status(400).json({ error: `Symbol ${s} is invalid.` });
            }
        }

        const newWatchlist = await Watchlist.create({
            name: name.trim(),
            symbols: cleanSymbols,
            owner: req.user.id,
            isPublic: false
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
        const watchlists = await Watchlist.find({
            $or: [
                { isPublic: true },
                { owner: req.user.id }
            ]
        }).sort({ createdAt: -1 });
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

        // Symbols ko clean karo (Trim, UpperCase, Unique)
        const cleanSymbols = [...new Set(symbols
            .map(s => s?.toString().toUpperCase().trim())
            .filter(s => s && s.length > 0))];

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

//validate stock symbol before adding to watchlist
exports.validateAndAdd = async (req, res) => {
    const { symbol } = req.body;
    const upperSymbol = symbol.toUpperCase().trim();

    // 1. Check if it exists in our Master List (Scalable & Optimized)
    const exists = await SymbolMaster.findOne({ symbol: upperSymbol });

    if (exists) {
        // Proceed to add in watchlist
        return res.json({ success: true, message: "Valid Symbol" });
    }

    // 2. Fallback: If not in DB, check once from NSE (Optional/On-demand)
    // Isse ye fayda hoga ki agar koi naya stock list hua hai jo hamare DB mein nahi hai,
    // toh wo bhi miss nahi hoga.
    const isNewValid = await verifyFromNSE(upperSymbol);
    if (isNewValid) {
        await SymbolMaster.create({ symbol: upperSymbol }); // Sync for future
        return res.json({ success: true });
    }

    return res.status(400).json({ error: "Invalid NSE Symbol" });
};

