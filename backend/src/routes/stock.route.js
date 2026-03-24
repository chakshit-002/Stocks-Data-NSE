const express = require('express'); 
const router = express.Router(); 
const stockController = require('../controllers/stock.controller'); 

// yh Route  bulk saving default stocks ke liye hai
router.post('/bulk-save', stockController.bulkSaveStocks); 

// yh Route  historical data of a specific stock laane ke liye hai....
router.get('/stocks/:symbol', stockController.getHistoricalData); 

//yh vala  Route for on-demand fetch and save (search bar with date and symbol) 
router.get('/fetch-and-save', stockController.fetchAndSaveStock); 

module.exports = router;