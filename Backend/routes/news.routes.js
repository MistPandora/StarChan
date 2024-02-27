const express = require('express');
const router = express.Router();

const newsKey = process.env.NEWS_API_KEY;

router.get('/', async (_, res) => {
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=space&language=fr&apiKey=${newsKey}`);
        const data = await response.json();
        res.json({ result: true, articles: data.articles });
    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }
});


module.exports = router;
