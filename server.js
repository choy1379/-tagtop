var express = require('express');
//search for tweeter
var bodyParser = require('body-parser');
var cors = require('cors');
var functions = require('./functions');
var route = require('routes')
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.post('/authorize', functions.authorize);
app.post('/search', functions.search);
app.post('/user', functions.user);
app.use(express.static(__dirname + "/app"));
app.listen(process.env.PORT || 4100);
console.log("Server up on port 4100");