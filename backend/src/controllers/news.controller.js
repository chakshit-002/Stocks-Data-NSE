const RSSParser = require('rss-parser');
const parser = new RSSParser();

const getStockNews = async (req, res) => {
    const { symbol } = req.params;
    const baseURL = process.env.GOOGLE_NEWS_RSS_URL;
    try {
        const finalURL = `${baseURL}?q=${symbol}+stock+india&hl=en-IN&gl=IN&ceid=IN:en`;
        // Google News RSS se news uthao - Ye hamesha articles deta hai
        const feed = await parser.parseURL(finalURL);
        
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