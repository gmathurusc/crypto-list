var express = require("express");
var bodyParser  = require("body-parser");
var path = require("path");

var app = express();

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

//Routes
app.use('/', require('./routes'));

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('public', path.join(__dirname, 'public'));

//Set Static Path
app.use(express.static(__dirname + '/public'));

app.listen(8001, function () {
    console.log("Server serving on 8001...");
});