var express = require('express');
var app = express();
var port = 3000;

//var restful = require('node-restful');
//var methodOverride = require('method-override');


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//template engine
app.set('view engine','ejs');
//routes
var users = require('./routes/users')


var expressValidator = require('express-validator')
app.use(expressValidator())

var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser('keyboard cat'))
app.use(session({ 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
app.use(flash())

//call routes

app.use('/', users)
app.listen(port,function(){
    console.log("Server listening on port " + port);
});