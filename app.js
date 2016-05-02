var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var httpSession = require('./libs/httpSession');

module.exports = function () {
    var app = express();

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(logger('dev'));
    app.use(httpSession());

    require('./routes')(app);

    return app;
};
