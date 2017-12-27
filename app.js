var express = require("express");
var bodyParser  = require("body-parser");
var path = require("path");
var router = express.Router();
var request = require('request');

var app = express();

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Set Static Path
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    request.get({ url: "https://api.coinmarketcap.com/v1/ticker/"},
        function(error, response, body) {
            // console.log(body);
            res.render('index', {
                title : 'Home',
                tickers : JSON.parse(body)
            })
    });
});

app.listen(8000, function () {
    console.log("Server serving on 8000...");
});