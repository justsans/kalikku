var Room = require ('../model/room');
var User = require('../model/user');
var RoomView = require('../model/roomView');
var CardDeckView = require('../model/cardDeckView');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function (app, rooms) {
    app.get( "/rooms", function( req, res ) {
        var arr = [];
        for ( var room_id in rooms ) {
            arr.push( rooms[room_id] );
        }
        res.send( { rooms: arr } );
    });

    app.get( "/room/new", function( req, res ) {
        var room_id = new Date().getTime();
        room_id += '_' + Math.random().toString(36).substring(7);
        var room = new Room(room_id);
        rooms[room_id] =  room;
        if(rooms[room_id]) {
            res.send( { result: 'success' , roomId: room_id } );
        }  else {
            res.send( { result: 'fail' } );
        }

    });

    app.io.route('/room/show', function(req) {
        var room_id = req.data.roomId;
        var userId = req.handshake.user.id;

        console.log('showing game:' + room_id + ',' + userId);
        var room = rooms[room_id];
        req.io.join(room_id);
        updateTable(room);
        req.io.join(room_id + '-' + userId);
        console.log('Joiningg ROOM: '+room_id + '-' + userId);
        updatePlayer(room, userId);
    });

    app.get( "/room/:id", function( req, res ) {
        var room_id = req.params.id;
        console.log('fetching room id: ' + room_id);
        var room = rooms[room_id];
        //req.io.join(room_id);
        res.send( getObjectToSendToUser(room) );
    });


    app.io.route('startGame', function(req) {
        var room_id = req.data.roomId;
        console.log('starting game:' + room_id);
        var room = rooms[room_id];

        room.start();

        updateTableAndAllPlayers(room);
    });



    app.io.route('call', function(req) {
        var room_id = req.data.roomId;
        var callValue = req.data.callValue;
        console.log('calling value:' + callValue);

        var room = rooms[room_id];
        var playerId = room.players[room.currentSlot].id;
        room.call(playerId, parseInt(callValue));
        updateTableAndAllPlayers(room);
        publishUndisplayedMessages(room, room_id);

    });

    app.io.route('join', function(req) {
//        console.log('user isss:::::::::::' + req.handshake.user);
        var room_id = req.data.roomId;
        var userId = req.handshake.user.id;

        var slotId = req.data.slotId;
        if(userId && userId != 'undefined') {

            User.findOne({'_id': new ObjectId(userId)}, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that email
                if (user) {
                    console.log('User requested to join table:' + userId);
                    req.io.join(room_id + '-' + userId);
                    var room = rooms[room_id];
                    if(!room.players[slotId]) {
                        room.addPlayer(userId, slotId, user.data.displayName);
                    }

                    app.io.room(room_id).broadcast('updateTable', getObjectToSendToUser(room));
                    publishUndisplayedMessages(room, room_id);
                }

            });
        }

    });

    app.io.route('selectTrump', function(req) {
        var room_id = req.data.roomId;
        var trumpSuit = req.data.suit;
        var trumpRank = req.data.rank;
        console.log('trump value:' + trumpSuit);

        var room = rooms[room_id];
        var playerId = room.players[room.currentSlot].id;
        room.selectTrump(playerId, trumpSuit, trumpRank);
        updateTableAndAllPlayers(room);
        publishUndisplayedMessages(room, room_id);
    }) ;

    app.io.route('play', function(req) {
        var room_id = req.data.roomId;
        var suit = req.data.suit;
        var rank = req.data.rank;
        console.log('card played:' + suit+rank);

        var room = rooms[room_id];
        var playerId = room.players[room.currentSlot].id;
        room.play(playerId, rank, suit);
        updateTableAndAllPlayers(room);
        publishUndisplayedMessages(room, room_id);
    }) ;


    function updateTableAndAllPlayers(room) {
        updateTable(room);
        updateAllPlayersWithCards(room);
    }

    function updateTable(room) {
        app.io.room(room.roomId).broadcast('updateTable', getObjectToSendToUser(room));
    }

    function updateCards(room, slotId) {
        app.io.room(room.roomId).broadcast('updateCards', getCardsToSendToUser(room, slotId));
    }

    function updateAllPlayersWithCards(room) {
        for(var i = 0; i < room.players.length; i++) {
            if(room.players[i]) {
               updatePlayer(room, room.players[i].id)
            }
        }

    }

    function updatePlayer(room, playerId) {
        var roomId = room.roomId + '-' + playerId;
        var currentSlot = room.currentSlot;
        if(room.players[currentSlot] && room.players[currentSlot].id == playerId) {
            updateCards(room, currentSlot);

        } else {
            for(var i = 0; i < room.players.length; i++) {
                if(room.players[i] && room.players[i].id == playerId) {
                    updateCards(room, i);
                }
            }
        }

    }

    function publishUndisplayedMessages(room, room_id) {
        if (room.displayedMessageId < room.messageId) {
            for (var i = room.displayedMessageId + 1; i < room.messageId; i++) {
                app.io.room(room_id).broadcast('updateMessage', room.messages[i]);
                room.displayedMessageId = i;
            }
        }
    }

    function getCardsToSendToUser(room, slotId) {
        return { cards: new CardDeckView(room, slotId), state: room.state };
    }

    function getObjectToSendToUser(room) {
        return { room: room, view: new RoomView(room) };
    }

};