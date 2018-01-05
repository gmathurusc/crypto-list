var express = require('express');
var router = express.Router();
var request = require('request');
var api = require("./public/config/api.json");
var currency = require("./public/config/currency.json");
var limit = require("./public/config/limit.json");

var tickerURL = api.coinmarketcap.base + api.coinmarketcap.ticker;
var globalURL = api.coinmarketcap.base + api.coinmarketcap.global;
var coincapHistoryURL = api.coincap.base + api.coincap.history_7day;

//Middle ware that is specific to this router
// router.use(function timeLog(req, res, next) {
//     console.log('Time: ', Date.now());
//     next();
// });

//Home
router.get('/', function (req, res) {

    request.get({ url: tickerURL+"?limit=0"},
        function(error, response, body) {
            res.render('index', {
                title : 'Crypto List',
                tickers : body,
                currency : currency,
                limit : limit
            })
        });
});

// router.get('/limit/', function (req, res) {
//     var query = req.query.limit;
//     request.get({ url: tickerURL+"?limit="+query},
//         function(error, response, body) {
//             res.render('index', {
//                 title : 'Limit',
//                 tickers : JSON.parse(body),
//                 limit : limit
//             })
//         });
// });
//
router.get('/currency/details/', function (req, res) {
    var currency = req.query.value.replace(/\s/g,"-");
    request.get({ url: tickerURL+"/"+currency},
        function(error, response, body) {
            res.send(body);
        });
});

router.get('/currency/history/', function (req, res) {
    var symbol = req.query.value;
    request.get({ url: coincapHistoryURL+"/"+symbol},
        function(error, response, body) {
            res.send(body);
        });
});
//
//
//
// //About
// router.get('/about', function(req, res) {
//     res.send('About us');
// });


module.exports = router;