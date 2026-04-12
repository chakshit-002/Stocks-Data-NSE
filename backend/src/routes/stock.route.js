const express = require('express'); 
const router = express.Router(); 
const stockController = require('../controllers/stock.controller'); 
const symbolMasterModel = require('../models/symbolMaster.model');

// yh Route  bulk saving default stocks ke liye hai
router.post('/bulk-save', stockController.bulkSaveStocks); 

// yh Route  historical data of a specific stock laane ke liye hai....
router.get('/stocks/:symbol', stockController.getHistoricalData); 

//yh vala  Route for on-demand fetch and save (search bar with date and symbol) 
router.get('/fetch-and-save', stockController.fetchAndSaveStock); 

// GET /api/search-symbols?q=IR
router.get('/search-symbols', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json([]);

        const query = q.toUpperCase().trim();
        
        // $regex: `^${query}` ka matlab hai jo is word se START hote hain
        const suggestions = await symbolMasterModel.find({
            symbol: { $regex: `^${query}` } 
        })
        .limit(10) // Sirf top 10 results dikhao
        .select('symbol -_id');

        res.json(suggestions.map(s => s.symbol));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;