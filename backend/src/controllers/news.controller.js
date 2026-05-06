const RSSParser = require('rss-parser');
const parser = new RSSParser();

const getStockNews = async (req, res) => {
    const { symbol } = req.params;
    const baseURL = process.env.GOOGLE_NEWS_RSS_URL;
    const query = encodeURIComponent(`${symbol} stock india`);
    const finalURL = `${baseURL}?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`;
    if (!baseURL) {
        console.error("❌ Env Error: GOOGLE_NEWS_RSS_URL is missing!");
        return res.json([]);
    }
    try {
        // 3. User-Agent Header add karo (VERY IMPORTANT for Deployment)
        const feed = await parser.parseURL({
            url: finalURL,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/rss+xml, application/xml, text/xml'
            }
        });

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