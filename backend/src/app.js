const express = require("express");
const stockRoutes = require('./routes/stock.route');
const watchlistRoutes = require('./routes/watchlist.route');

const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use('/api', stockRoutes);
app.use('/api', watchlistRoutes);


module.exports = app;