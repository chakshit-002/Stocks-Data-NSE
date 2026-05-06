// const axios = require('axios');

// const getStockNews = async (req, res) => {
//     const { symbol } = req.params;
//     const query = `${symbol.toUpperCase()} share news`;

//     try {
//         // GDELT URL mein broad query bhejo
//         const url = ``;

//         const response = await axios.get(url);

//         // GDELT ka data thoda deep hota hai, check karo agar data hai
//         if (response.data && response.data.articles) {
//             res.json(response.data.articles);
//         } else {
//             res.status(404).json({ message: "No recent news found for this stock." });
//         }
//     } catch (err) {
//         console.error("News Error:", err.message);
//         res.status(500).json({ error: "News fetch karne mein dikkat aayi bhai!" });
//     }
// };

// module.exports = { getStockNews };



const RSSParser = require('rss-parser');
const parser = new RSSParser();

const getStockNews = async (req, res) => {
    const { symbol } = req.params;
    try {
        // Google News RSS se news uthao - Ye hamesha articles deta hai
        const feed = await parser.parseURL(`https://news.google.com/rss/search?q=${symbol}+stock+india&hl=en-IN&gl=IN&ceid=IN:en`);
        
        const articles = feed.items.map(item => ({
            title: item.title,
            url: item.link,
            date: item.pubDate,
            source: item.source || 'Market News'
        }));

        res.json(articles); // Ye perfect JSON bhejega frontend ko
    } catch (err) {
        console.error("RSS Error:", err.message);
        res.json([]); // Fail hone par khali array
    }
};
module.exports = { getStockNews };