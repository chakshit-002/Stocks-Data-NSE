const express = require("express");
const stockRoutes = require('./routes/stock.route');
const watchlistRoutes = require('./routes/watchlist.route');
const authRoutes = require('./routes/auth.route')
const newsRoutes = require('./routes/news.route');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const allowedOrigins = [
  "https://stock-data-nse.netlify.app",
  "http://localhost:5173"
];

app.use(express.json());
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());


app.get('/', (req, res) => {
    res.status(200).json({
        status: 'UP',
        message: 'Server is running smoothly',
        timestamp: new Date()
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api', stockRoutes);
app.use('/api', watchlistRoutes);

module.exports = app;