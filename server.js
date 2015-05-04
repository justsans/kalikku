
var express = require( "express.io" ),
    app = express(),
    cons = require( "consolidate" );

var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');


var configDB = require('./config/database.js');

require('./config/passport')(passport); // pass passport for configuration


app.http().io();

app.use( express.static( __dirname + "/public" ) );
app.use(express.cookieParser()); // read cookies (needed for auth)
app.use(express.bodyParser()); // get information from html forms
app.use(express.logger('dev')); // log every request to the console

app.engine( "dot", cons.dot );
app.set( "view engine", "dot" );
app.set( "views", __dirname + "/public/tmpl" );

//////////////////
//mongoose.connect(configDB.url); // connect to our database
var passportSocketIo = require("passport.socketio");
var session = require('express-session');
var MongoStore = require('connect-mongostore')(session);
var sessionStore = new MongoStore(configDB.dbConfig);

var sessionConfig = {
    key:    'connect.sid',       //the cookie where express (or connect) stores its session id.
    secret: configDB.cookie_secret, //the session secret to parse the cookie
    store:   sessionStore
}


var old_auth = app.io.get('authorization')
app.io.set("authorization", passportSocketIo.authorize( {
        passport: passport,
        cookieParser: express.cookieParser,
        key: 'connect.sid',
        secret: configDB.cookie_secret,
        store: sessionStore,
        success: function(data, accept) {
            old_auth(data, accept);
        }
    }));
///////////////


// required for passport
app.use(express.cookieParser());
app.use(express.session(sessionConfig)); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


var Room = require ('./model/room');

var rooms = {};
rooms['Beginers'] = new Room('Beginers', false);
rooms['Machans'] = new Room('Machans', false);



require("./routes/configure")(app, rooms, passport);
var port = process.env.PORT || 5000;


mongoose.connect(configDB.url, function () {
    app.listen(port);
});

//app.listen( port );
