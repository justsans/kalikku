
var express = require( "express" ),
    app = express(),
    cons = require( "consolidate" );

var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var cookie_parser = require('cookie-parser');
var body_parser = require('body-parser');
var morgan = require('morgan');


var configDB = require('./config/database.js');

require('./config/passport')(passport); // pass passport for configuration


//app.http().io();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.sockets.on('connection', function (socket) {
    console.log('socket connected');

    socket.on('disconnect', function () {
        console.log('socket disconnected');
    });

    socket.emit('text', 'wow. such event. very real time.');
});

///////////

app.use( express.static( __dirname + "/public" ) );
app.use(cookie_parser()); // read cookies (needed for auth)
app.use(body_parser()); // get information from html forms
app.use(morgan('dev')); // log every request to the console

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


//var old_auth = io.get('authorization')
//io.set("authorization", passportSocketIo.authorize( {
//        passport: passport,
//        cookieParser: express.cookieParser,
//        key: 'connect.sid',
//        secret: configDB.cookie_secret,
//        store: sessionStore,
//        success: function(data, accept) {
//            old_auth(data, accept);
//        }
//    }));

io.use(passportSocketIo.authorize({
    cookieParser: cookie_parser,       // the same middleware you registrer in express
    key:          'connect.sid',       // the name of the cookie where express/connect stores its session_id
    secret:       configDB.cookie_secret,    // the session_secret to parse the cookie
    store:        sessionStore,      // we NEED to use a sessionstore. no memorystore please
    success:      function(data, accept) {
      debugger;
      console.log('data is ' + data);
      data.socket.user = data.user;
      data.socket.userid = data.user.id;
      accept();
    }
    //fail:         onAuthorizeFail     // *optional* callback on fail/error - read more below
}));


//app.io.set('transports', ['websocket', 'xhr-polling', 'jsonp-polling', 'htmlfile', 'flashsocket']);
//app.io.set('origins', '*:*');

///////////////

 //CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
//app.all('*', function(req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "X-Requested-With");
//    next();
//});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
});
//app.use(express.static(__dirname + '/conference/www'));


// required for passport
app.use(session(sessionConfig)); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


var Room = require ('./model/room');

var rooms = {};
rooms['Beginers'] = new Room('Beginers', false);
rooms['Machans'] = new Room('Machans', false);
rooms['Utd'] = new Room('Utd', false);
rooms['Dallas'] = new Room('Dallas', false);
rooms['India'] = new Room('India', false);
rooms['Kerala'] = new Room('Kerala', false);



require("./routes/configure")(app, rooms, passport, io, sessionStore);
var port = process.env.PORT || 5000;


mongoose.connect(configDB.url, function () {

    http.listen(port, function(){
        console.log('listening on *:'+port);
    });
});

//app.listen( port );
