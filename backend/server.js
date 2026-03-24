require('dotenv').config();
const app = require('./src/app')
const PORT = 3001
const connectDB = require('./src/db/db')
connectDB();

// index.js ya server.js mein sabse upar routes ke saath
router.get('/', (req, res) => {
    res.status(200).json({ 
        status: 'UP', 
        message: 'Server is running smoothly',
        timestamp: new Date()
    });
});

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})

