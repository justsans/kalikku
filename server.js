var express = require( "express.io" ),
    app = express(),
    cons = require( "consolidate" );

var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration


app.http().io();

app.use( express.static( __dirname + "/public" ) );
app.use(express.cookieParser()); // read cookies (needed for auth)
app.use(express.bodyParser()); // get information from html forms
app.use(express.logger('dev')); // log every request to the console

app.engine( "dot", cons.dot );
app.set( "view engine", "dot" );
app.set( "views", __dirname + "/public/tmpl" );

// required for passport
app.use(express.session({ secret: 'dennisinuithukaliyakampakshenjangalkithuverumkaliyalla' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


var Room = require ('./model/room');

var rooms = {};
rooms['1'] = new Room('1', true);

require("./routes/configure")(app, rooms, passport);
var port = process.env.PORT || 5000;

app.listen( port );
