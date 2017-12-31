var express = require('express');
var router = express.Router();
var request = require('request');
var api = require("./public/config/api.json");
var currency = require("./public/config/currency.json");
var limit = require("./public/config/limit.json");

var tickerURL = api.base + api.ticker;
var globalURL = api.base + api.global;

//Middle ware that is specific to this router
// router.use(function timeLog(req, res, next) {
//     console.log('Time: ', Date.now());
//     next();
// });

//Home
router.get('/', function (req, res) {

    request.get({ url: tickerURL+"?limit=1000"},
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
// router.get('/currency/', function (req, res) {
//     var currency = req.query.currency;
//     // console.log(currency);
//     // console.log(tickerURL+"?convert="+currency);
//     request.get({ url: tickerURL+"?convert="+currency},
//         function(error, response, body) {
//             res.render('index', {
//                 title : 'Home',
//                 tickers : JSON.parse(body),
//                 currency : currency,
//             })
//         });
// });
//
//
//
// //About
// router.get('/about', function(req, res) {
//     res.send('About us');
// });


module.exports = router;