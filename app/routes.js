const express = require('express');
const router = express.Router();
const request = require('request');
const NodeCache = require( "node-cache" );
const api = require("./public/config/api.json");
const currency = require("./public/config/currency.json");
const axios = require('axios');

const tickerURL = api.coinmarketcap.base + api.coinmarketcap.ticker;
const coinCapURL = api.coincap.base;
const coinCompare = {
    "list": api.cryptoCompare.base + api.cryptoCompare.coinList,
    "details": api.cryptoCompare.base + api.cryptoCompare.coinDetails
};

const cache = new NodeCache({ stdTTL: 600} );


router.get('/', async (req, res) => {
    try {
        const tickers = await getTickers();

        // Render the page with tickers
        res.render('home', {
            title: 'Home',
            tickers: tickers
        });
    } catch (error) {
        console.error("Error fetching tickers: ", error);
        res.status(500).send("An error occurred while fetching data.");
    }
});


router.get('/details/', async  (req, res) => {
    const name = req.query.value;
    if(name === undefined) {
        res.redirect('/');
    }
    let tickers;
    if(cache.get("tickers")) {
        console.log("cached ticker");
        tickers = cache.get("tickers");
    }
    else {
        tickers = await getTickers();
    }
    let id, title, symbol, display, details;
    if(tickers) {
        display = tickers.find(ticker => ticker.name === name);
    }
    if(cache.get("ticker_basic_info")) {
        console.log("cached ticker_basic_info");
        const tickerInfo = cache.get("ticker_basic_info");
        details = tickerInfo.find(ticker => ticker.name === name);

    }
    else {
        id = name.replace(/ /g,'').toLowerCase();
    }

    res.render('currency-detail', {
        title : title,
        details : details,
        display : [display]
    })
});

router.get('/currency/history/', async (req, res) => {
    const symbol = req.query.value.replaceAll(" ", "-");
    const day = req.query.day ? req.query.day : 7;
    const dayMap = {
        'one_day': 1,
        'seven_day': 7,
        'thirty_day': 30,
        'ninety_day': 90
    }
    const param = dayMap[day] === 1 ? 'h1' : 'd1';
    const coincapHistoryURL = coinCapURL + symbol.toLowerCase() + "/history?interval=" + param;


    const response = await axios.get(coincapHistoryURL);
    const data = response.data.data; // Axios wraps the response in a `data` object
    const sliceParam = dayMap[day] === 1 ? -24 : -1 * dayMap[day]
    const requiredHistory = data.slice(sliceParam);

    res.send(requiredHistory);
});

router.get('/currency/details/', async (req, res) => {
    const symbol = req.query.value;
    const tickers = cache.get("ticker_basic_info");
    const unique_id = tickers.find(ticker => ticker.symbol === symbol).unique_id;

    const body = await axios.get(coinCompare.details+"/?id="+unique_id);
    res.send(body.data);
});

async function setTickerBasicInfoCache() {
    let tickers = cache.get("tickers");
    let tickerArray = [];
    for(let i = 0; i < tickers.length; i++) {
        tickerArray.push({
            'id' : tickers[i]['id'],
            'name' : tickers[i]['name'],
            'symbol' : tickers[i]['symbol']
        });
    }

    await addMoreTickerBasicInfo(tickerArray);
}

async function addMoreTickerBasicInfo(tickers) {
    const list = await axios.get(coinCompare.list);
    const info = list.data['Data'];
    for(let i = 0; i < tickers.length; i++) {
        const symbol = tickers[i]['symbol'];
        const getInfo = info["" + symbol];
        if (getInfo !== undefined) {
            tickers[i]['url'] = getInfo.hasOwnProperty("Url") ? getInfo['Url'] : "";
            tickers[i]['image_url'] = getInfo.hasOwnProperty("ImageUrl") ? getInfo['ImageUrl'] : "";
            tickers[i]['unique_id'] = getInfo.hasOwnProperty("Id") ? getInfo['Id'] : "";
            tickers[i]['description'] = getInfo.hasOwnProperty("Description") ? getInfo['Description'] : "";
        }
    }
    cache.set('ticker_basic_info', tickers, 5184000);
}

async function getTickers() {
    const cachedTickers = cache.get("tickers");
    if (cachedTickers) {
        return cachedTickers;
    }

    // Fetch tickers from the API
    console.log("Fetching tickers...");
    const response = await axios.get(`${tickerURL}?CMC_PRO_API_KEY=${process.env.CMC_PRO_API_KEY}`);
    const body = response.data;

    // Transform data into desired format
    const tickers = body.data.map(item => ({
        id: item.id,
        symbol: item.symbol,
        rank: item.cmc_rank,
        name: item.name,
        market_cap_usd: item.quote.USD.market_cap,
        price_usd: item.quote.USD.price,
        available_supply: item.circulating_supply,
        total_supply: item.total_supply,
        max_supply: item.max_supply,
        "24h_volume_usd": item.quote.USD.volume_24h,
        percent_change_1h: item.quote.USD.percent_change_1h,
        percent_change_24h: item.quote.USD.percent_change_24h,
        percent_change_7d: item.quote.USD.percent_change_7d
    }));

    // Cache the fetched data
    cache.set('tickers', tickers);
    await setTickerBasicInfoCache();

    return tickers;
}

module.exports = router;
