// src/models/stock.model.js 
const mongoose = require('mongoose'); 

const stockDataSchema = new mongoose.Schema({ 
    date: { 
        type: Date, 
        required: true, 
    }, 
    symbol: { 
        type: String, 
        required: true, 
        trim: true, 
    }, 
    open: Number, 
    high: Number, 
    low: Number, 
    close: Number, 
    noOfTrade: Number, 
    turnOverLac: Number, 
    delivery: Number,
    volume: Number, 
    deliveryPercent:Number 
     
}, { 
    timestamps: true, 
}); 

// Unique index se duplicate entries nahi hongi 
stockDataSchema.index({ date: 1, symbol: 1 }, { unique: true }); 

const Stock = mongoose.model('Stock', stockDataSchema); 

module.exports = Stock


// Aap yahan aur fields bhi add kar sakte hain, jaise: 
    // `series: String`, `turnover: Number` 