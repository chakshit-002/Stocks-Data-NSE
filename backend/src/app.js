const express = require("express");
const stockRoutes = require('./routes/stock.route');
const watchlistRoutes = require('./routes/watchlist.route');

const cors = require('cors');
const app = express();
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];
app.use(express.json());
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'UP',
        message: 'Server is running smoothly',
        timestamp: new Date()
    });
});

app.use('/api', stockRoutes);
app.use('/api', watchlistRoutes);


module.exports = app;