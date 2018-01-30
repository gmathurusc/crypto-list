var express = require('express');
var router = express.Router();
var request = require('request');
const NodeCache = require( "node-cache" );
var api = require("./public/config/api.json");
var currency = require("./public/config/currency.json");
var limit = require("./public/config/limit.json");

var tickerURL = api.coinmarketcap.base + api.coinmarketcap.ticker;
var coinCapURL = api.coincap.base;
var history = {
    'one_day': api.coincap.history_1day,
    'seven_day': api.coincap.history_7day,
    'thirty_day': api.coincap.history_30day,
    'ninety_day': api.coincap.history_90day
};
var coinCompare = {
    "list": api.cryptoCompare.base + api.cryptoCompare.coinList,
    "details": api.cryptoCompare.base + api.cryptoCompare.coinDetails
};

const cache = new NodeCache({ stdTTL: 600} );

//Middle ware that is specific to this router
// router.use(function timeLog(req, res, next) {
//     console.log('Time: ', Date.now());
//     next();
// });

//Home
router.get('/', function (req, res) {
    render = true;
    var tickers;
    if(cache.get("tickers")) {
        console.log("cached");
        tickers = cache.get("tickers");
        res.render('home', {
            title : 'Home',
            tickers : tickers
        })
    }
    else {
        request.get({ url: tickerURL+"?limit=0"},
            function(error, response, body) {
                console.log("caching....");
                cache.set('tickers', body);
                setTickerBasicInfoCache();
                tickers = body;
                res.render('home', {
                    title : 'Home',
                    tickers : tickers
                })
            });
    }

});

router.get('/details/', function (req, res) {
    var name = req.query.value;
    var tickers;
    if(cache.get("ticker_basic_info")) {
        console.log("cached ticker");
        tickers = cache.get("ticker_basic_info");
    }
    else {
        request.get({ url: tickerURL+"?limit=0"},
            function(error, response, body) {
                tickers = JSON.parse(body);
                console.log("caching in details...");
                cache.set('tickers', body);
                setTickerBasicInfoCache();
        });
    }
    var id, title, symbol;
    if(tickers) {
        for(var i = 0; i < tickers.length; i++) {
            if(tickers[i]['name'] === name) {
                id = tickers[i]['id'];
                title = tickers[i]['name'];
                symbol = tickers[i]['symbol'];
                break;
            }
        }
    }
    else {
        id = name.replace(/ /g,'').toLowerCase();
    }

    request.get({ url: tickerURL+"/"+id},
        function(error, response, body) {
            res.render('currency-detail', {
                title : title,
                details : body,
                display : JSON.parse(body)
            })
        });
});

router.get('/currency/history/', function (req, res) {
    var symbol = req.query.value;
    var day = req.query.day ? req.query.day : 'seven_day';
    var coincapHistoryURL = coinCapURL + history[day];
    console.log("calling : " + coincapHistoryURL);
    request.get({ url: coincapHistoryURL+"/"+symbol},
        function(error, response, body) {
            res.send(body);
        });
});

router.get('/currency/details/', function (req, res) {
    var symbol = req.query.value;
    var tickers = cache.get("ticker_basic_info");
    for(var i = 0; i < tickers.length; i++) {
        if(tickers[i]['symbol'] === symbol) {
            var unique_id = tickers[i]['unique_id'];
            break;
        }
    }
    request.get({ url: coinCompare.details+"/?id="+unique_id},
        function(error, response, body) {
            console.log(body);
            res.send(body);
        });
});

function setTickerBasicInfoCache() {
    var tickers = JSON.parse(cache.get("tickers"));
    var tickerArray = [];
    for(var i = 0; i < tickers.length; i++) {
        tickerArray.push({
            'id' : tickers[i]['id'],
            'name' : tickers[i]['name'],
            'symbol' : tickers[i]['symbol']
        });
    }
    cache.set('ticker_basic_info', tickerArray, 5184000);
    addMoreTickerBasicInfo();
}

function addMoreTickerBasicInfo() {
    var tickers = cache.get("ticker_basic_info");
    request.get({ url: coinCompare.list},
        function(error, response, body) {
            var info = JSON.parse(body)['Data'];
            for(var i = 0; i < tickers.length; i++) {
                var symbol = tickers[i]['symbol'];
                var getInfo = info[""+ symbol];
                if(getInfo !== undefined) {
                    tickers[i]['url'] = getInfo.hasOwnProperty("Url") ? getInfo['Url'] : "";
                    tickers[i]['image_url'] = getInfo.hasOwnProperty("ImageUrl") ? getInfo['ImageUrl'] : "";
                    tickers[i]['unique_id'] = getInfo.hasOwnProperty("Id") ? getInfo['Id'] : "";
                }
            }
            cache.set('ticker_basic_info', tickers, 5184000);
        });
}


module.exports = router;