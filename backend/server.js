require('dotenv').config();
const app = require('./src/app');
const PORT = 3001;
const connectDB = require('./src/db/db');
const { fetchAndProcessData } = require('./src/controllers/stock.controller'); // Import logic
const SymbolMaster = require('./src/models/symbolMaster.model');
const moment = require('moment');

const seedMasterFromNSE = async () => {
    try {
        const count = await SymbolMaster.countDocuments();

        if (count === 0) {
            console.log("Master List empty. Fetching symbols from NSE...");
            // Aaj se 2-3 din peeche ki date safe hoti hai (Working day ke liye)
            const testDate = moment().subtract(3, 'days').format('DDMMYYYY');
            const csvData = await fetchAndProcessData(testDate);

            if (csvData && csvData.length > 0) {
                // CSV se sirf SYMBOL column uthao, clean karo aur Unique set banao
                const symbolSet = new Set(
                    csvData
                        .map(row => row.SYMBOL?.trim().toUpperCase())
                        .filter(s => s && s !== 'SYMBOL') // Header skip karne ke liye
                );

                const finalDocs = Array.from(symbolSet).map(s => ({ symbol: s }));

                // Bulk insert with ordered: false (taaki duplicate se crash na ho)
                await SymbolMaster.insertMany(finalDocs, { ordered: false });
                console.log(`✅ Master List Ready: ${finalDocs.length} symbols stored.`);
            }
        }
    } catch (err) {
        console.error("❌ Master Seeding Failed:", err.message);
    }
};

connectDB().then(() => {
    seedMasterFromNSE(); // DB connect hone ke baad seed chalao
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
});