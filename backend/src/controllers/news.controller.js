// const RSSParser = require('rss-parser');
// const parser = new RSSParser();

// const getStockNews = async (req, res) => {
//     const { symbol } = req.params;
//     const baseURL = process.env.GOOGLE_NEWS_RSS_URL;
//     const query = encodeURIComponent(`${symbol} stock india`);
//     const finalURL = `${baseURL}?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`;
//     console.log(baseURL," ",finalURL)
//     if (!baseURL) {
//         console.error("❌ Env Error: GOOGLE_NEWS_RSS_URL is missing!");
//         return res.json([]);
//     }
//     try {
//         // 3. User-Agent Header add karo (VERY IMPORTANT for Deployment)
//         const feed = await parser.parseURL(finalURL);

//         const articles = feed.items.map(item => ({
//             title: item.title,
//             url: item.link,
//             date: item.pubDate,
//             source: item.source || 'Market News'
//         }));

//         res.json(articles); // Ye perfect JSON bhejega frontend ko
//     } catch (err) {
//         console.error("RSS Error:", err.message);
//         res.json([]); // Fail hone par khali array
//     }
// };
// module.exports = { getStockNews };


// const RSSParser = require('rss-parser');

// const parser = new RSSParser({
//     headers: {
//         'User-Agent':
//             'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
//     },
//     timeout: 10000
// });

// const getStockNews = async (req, res) => {
//     const { symbol } = req.params;
//     const baseURL = process.env.GOOGLE_NEWS_RSS_URL
//     const query = encodeURIComponent(`${symbol} stock india news`);

//     const finalURL = `${baseURL}?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`;

//     try {

//         const feed = await parser.parseURL(finalURL);

//         if (!feed.items || feed.items.length === 0) {
//             return res.json([]);
//         }

//         const articles = feed.items.slice(0, 20).map(item => ({
//             title: item.title,
//             url: item.link,
//             date: item.pubDate,
//             source: item.source?.title || item.source || 'Market News'
//         }));

//         res.json(articles);

//     } catch (err) {

//         console.error("RSS ERROR:", err);

//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch news"
//         });
//     }
// };

// module.exports = { getStockNews };



const axios = require('axios');
const xml2js = require('xml2js');

const getStockNews = async (req, res) => {

    const { symbol } = req.params;

    const query = encodeURIComponent(
        `${symbol} stock india news`
    );

    const url =
        `https://news.google.com/rss/search?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`;

    try {

        const response = await axios.get(url, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        const parsed = await xml2js.parseStringPromise(
            response.data
        );

        const items =
            parsed?.rss?.channel?.[0]?.item || [];


        const articles = items
            .map(item => ({
                title: item.title?.[0],
                url: item.link?.[0],
                date: item.pubDate?.[0],
                source: item.source?.[0]?._ || 'Market News'
            }))

            // Invalid dates hata do
            .filter(article => article.date)

            // Latest to oldest sort
            .sort((a, b) =>
                new Date(b.date) - new Date(a.date)
            )

            // Sirf top 20
            .slice(0, 20);



        res.json(articles);

    } catch (err) {

        console.error("GOOGLE RSS ERROR:", err.message);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

module.exports = { getStockNews };

