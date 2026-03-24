const express = require("express");
const stockRoutes = require('./routes/stock.route');
const watchlistRoutes = require('./routes/watchlist.route');

const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', stockRoutes);
app.use('/api', watchlistRoutes);


module.exports = app;