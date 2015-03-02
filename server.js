var express = require( "express.io" ),
    app = express(),
    cons = require( "consolidate" );
app.http().io();

app.use( express.static( __dirname + "/public" ) );
app.engine( "dot", cons.dot );
app.set( "view engine", "dot" );
app.set( "views", __dirname + "/public/tmpl" );

var Room = require ('./model/room');

var rooms = {};
rooms['1'] = new Room('1', true);

require("./routes/configure")(app, rooms);

app.listen( 5000 );
