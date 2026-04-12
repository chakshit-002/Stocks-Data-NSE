// models/symbolMaster.model.js
const mongoose = require('mongoose');

const symbolMasterSchema = new mongoose.Schema({
    symbol: {
        type: String,
        unique: true,
        required: true,
        uppercase: true,
        trim: true,
        index: true // Isse search suggestions super fast ho jayenge
    }
});
const symbolMasterModel = mongoose.model('SymbolMaster', symbolMasterSchema);
module.exports = symbolMasterModel;