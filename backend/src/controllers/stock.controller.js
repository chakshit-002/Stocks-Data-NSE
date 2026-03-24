const axios = require('axios');
const csv = require('csv-parser');
const moment = require('moment');
const Stock = require('../models/stock.model');
const Watchlist = require("../models/watchlist.model")
const DEFAULT_STOCKS = [
    'TATAPOWER', 'ADANIPOWER', 'IREDA', 'PFC', 'RECLTD', 'NHPC', 'JSWENERGY', 'TITAGARH', 'IRCON', 'BEML', 'RITES', 'RVNL', 'JWL', 'RAILTEL', 'TEXRAIL', 'TRANSRAILL',
    'HAL', 'BEL', 'MAZDOCK', 'BDL', 'COCHINSHIP', 'GRSE', 'PARAS', 'ZENTEC', 'APOLLO', 'MTARTECH', 'DATAPATTNS', 'KRISHNADEF', 'CPPLUS', 'SYRMA', 'MICEL', 'AVALON',
    'CENTUM', 'MOSCHIP', 'KAYNES', 'AMBER', 'TATAELXSI', 'DIXON', 'DCXINDIA', 'PGEL', 'CGPOWER', 'FIVESTAR', 'BAJAJHFL', 'SHRIRAMFIN', 'LICI', 'GICRE', 'AAVAS',
    'SHANTIGOLD', 'JSWCEMENT', 'LOTUSDEV', 'VMM', 'VIKRAN', 'HBLENGINE', 'ADANIENSOL', 'ADANIPORTS', 'ADANIGREEN', 'RELIANCE', 'RTNPOWER', 'TCS', 'INFY', 'ICICIBANK',
    'HDFCBANK', 'SBIN', 'SJS', 'LUMAXTECH', 'NEWGEN', 'ZENSARTECH', 'HAPPSTMNDS', 'BHEL', 'SERVOTECH', 'BPCL', 'TEJASNET', 'TATAMOTORS', 'GRAVITA', 'NETWEB', 'GESHIP',
    'SCI', 'KCPSUGIND', 'INFIBEAM', 'GREENPOWER', 'OSWALPUMPS', 'SHAKTIPUMP', 'SHABLY', 'PROSTARM', 'IRFC', 'TDPOWERSYS', 'BBOX', 'BLACKBUCK', 'EXIDEIND', 'ARE&M',
    'COALINDIA', 'WAAREEENER', 'WAAREERTL', 'PREMIERENE', 'SWSOLAR', 'TORNTPOWER', 'NTPCGREEN', 'EXICOM', 'HDBFS', 'CDSL', 'BSE', 'KFINTECH', 'MOTILALOFS',
    'ANGELONE', 'ANANDRATHI', 'CAMS'
]; // yh default stocks array 

const dataURL = process.env.DATA_FETCH_URL;

// Function to fetch data from NSE archives for a specific date 
const fetchAndProcessData = async (date) => {
    const url = dataURL.replace('{{DATE}}', date);
    try {
        const response = await axios.get(url, { responseType: 'stream' });
        const results = [];
        return new Promise((resolve, reject) => {
            response.data
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', (err) => {
                    // Handle CSV parsing errors
                    console.error('CSV parsing error:', err.message);
                    reject(new Error('Failed to parse CSV data.'));
                });
        });
    } catch (err) {
        // Handle Axios network errors, like 404 (Not Found)
        if (err.response && err.response.status === 404) {
            console.error(`Data not found for date ${date}: 404 Not Found`);
            throw new Error(`Data not available for date ${date}.`);
        } else {
            console.error('Error fetching data:', err.message);
            throw new Error(`Failed to fetch data from NSE: ${err.message}`);
        }
    }
};

// Helper function to safely parse CSV fields
const parseField = (row, fieldName, type = 'float') => {
    // Aas-paas ke spaces trim karke key dhoondo
    const key = Object.keys(row).find(k => k.trim() === fieldName);
    const value = row[key];
    if (type === 'int') return parseInt(value) || 0;
    return parseFloat(value) || 0;
};


exports.bulkSaveStocks = async (req, res) => {
    const { dates, watchlistId } = req.body;

    if (!dates || !Array.isArray(dates) || dates.length === 0) {
        return res.status(400).json({ error: 'Dates array is required.' });
    }

    let stocksToFetch = DEFAULT_STOCKS;
    if (watchlistId) {
        // ... (aapka watchlist fetch logic sahi hai, bas symbols ko trim/uppercase kar lena)
        const watchlist = await Watchlist.findById(watchlistId);
        if (!watchlist) return res.status(404).json({ error: 'Watchlist not found.' });
        stocksToFetch = watchlist.symbols.map(s => s.toUpperCase().trim());
    }

    let totalSaved = 0;
    let totalSkipped = 0;
    let errorLogs = [];

    for (const dateString of dates) {
        try {
            const formattedDate = moment(dateString, 'DDMMYYYY').toDate();
            const csvData = await fetchAndProcessData(dateString);

            const bulkOps = []; // Is date ke saare stocks yahan jama honge

            for (const symbol of stocksToFetch) {
                const stockRecord = csvData.find(row =>
                    row.SYMBOL && row.SYMBOL.trim() === symbol
                );

                if (stockRecord) {
                    bulkOps.push({
                        date: formattedDate,
                        symbol: symbol,
                        open: parseField(stockRecord, 'OPEN_PRICE'),
                        high: parseField(stockRecord, 'HIGH_PRICE'),
                        low: parseField(stockRecord, 'LOW_PRICE'),
                        close: parseField(stockRecord, 'CLOSE_PRICE'),
                        noOfTrade: parseField(stockRecord, 'NO_OF_TRADES', 'int'),
                        turnOverLac: parseField(stockRecord, 'TURNOVER_LACS'),
                        delivery: parseField(stockRecord, 'DELIV_QTY', 'int') / 100000,
                        volume: parseField(stockRecord, 'TTL_TRD_QNTY', 'int') / 100000,
                        deliveryPercent: parseField(stockRecord, 'DELIV_PER'),
                    });
                }
            }

            if (bulkOps.length > 0) {
                // insertMany with ordered:false duplicates ko skip karega bina error diye
                try {
                    const result = await Stock.insertMany(bulkOps, { ordered: false });
                    totalSaved += result.length;
                } catch (bulkErr) {
                    // Agar duplicates hain toh wo yahan handle honge
                    totalSaved += bulkErr.insertedDocs?.length || 0;
                    totalSkipped += (bulkOps.length - (bulkErr.insertedDocs?.length || 0));
                }
            }
        } catch (dateErr) {
            errorLogs.push(`Date ${dateString} failed: ${dateErr.message}`);
        }
    }

    res.status(200).json({
        message: 'Process completed.',
        saved: totalSaved,
        skipped: totalSkipped,
        errors: errorLogs
    });
};



// Controller for getting a specific stock's historical data 
exports.getHistoricalData = async (req, res) => {
    const { symbol } = req.params;

    if (!symbol) {
        return res.status(400).json({ error: 'Stock symbol is required.' });
    }

    try {
        const stockHistory = await Stock.find({ symbol: symbol.toUpperCase() }).sort({ date: 1 });

        if (stockHistory.length > 0) {
            res.json(stockHistory);
        } else {
            res.status(404).json({ message: 'Stock data not found in database.' });
        }
    } catch (err) {
        console.error('Error fetching historical data:', err.message);
        res.status(500).json({ error: 'Failed to fetch historical data.' });
    }
};

// Controller for on-demand fetch and save 

exports.fetchAndSaveStock = async (req, res) => {
    const { symbol, date } = req.query;

    if (!symbol || !date) {
        return res.status(400).json({ error: 'Stock symbol and date are required.' });
    }

    const formattedDateForDB = moment(date, 'DDMMYYYY').toDate();
    const upperSymbol = symbol.toUpperCase().trim();

    try {
        const dbResult = await Stock.findOne({
            date: formattedDateForDB,
            symbol: upperSymbol,
        });

        if (dbResult) {
            return res.json({ message: 'Data already exists.', data: dbResult });
        }

        const csvData = await fetchAndProcessData(date);
        const stockRecord = csvData.find(row => row.SYMBOL && row.SYMBOL.trim() === upperSymbol);

        if (stockRecord) {
            // Yahan bhi parseField helper use karo taaki error na aaye
            const stockData = {
                date: formattedDateForDB,
                symbol: upperSymbol,
                open: parseField(stockRecord, 'OPEN_PRICE'),
                high: parseField(stockRecord, 'HIGH_PRICE'),
                low: parseField(stockRecord, 'LOW_PRICE'),
                close: parseField(stockRecord, 'CLOSE_PRICE'),
                noOfTrade: parseField(stockRecord, 'NO_OF_TRADES', 'int'),
                turnOverLac: parseField(stockRecord, 'TURNOVER_LACS'),
                delivery: parseField(stockRecord, 'DELIV_QTY', 'int') / 100000,
                volume: parseField(stockRecord, 'TTL_TRD_QNTY', 'int') / 100000,
                deliveryPercent: parseField(stockRecord, 'DELIV_PER'),
            };
            await Stock.create(stockData);
            return res.status(201).json({ message: 'Data fetched and saved.', data: stockData });
        } else {
            return res.status(404).json({ message: 'Stock data not found in NSE archives.' });
        }
    } catch (err) {
        console.error('Error in fetch and save operation:', err.message);
        res.status(500).json({ error: 'Failed to fetch and save stock data.' });
    }
};













