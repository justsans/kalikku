var Room = require ('../model/room');
var User = require('../model/user');
var STATES = require('../model/states');
var RoomView = require('../model/roomView');
var CardDeckView = require('../model/cardDeckView');
var ObjectId = require('mongoose').Types.ObjectId;
var Simulator = require('../spec/util/simulatorUtil');

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
        var room_id = room_id + '-' + userId;
        req.io.join(room_id);
        console.log('Joiningg ROOM: '+room_id);
        updatePlayer(room, userId);
        updateCurrentPlayerWithCallValues(room);
        publishAllMessages(room, room_id);
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
        //var simulator = new Simulator();
        //simulator.callAndSelectTrumpWithPlayerId(room, '553a97c9ffd561c00e44c28c');

        updateTableAndAllPlayers(room);


    });



    app.io.route('call', function(req) {
        var room_id = req.data.roomId;
        var callValue = req.data.callValue;
        var userId = req.handshake.user.id;
        var room = rooms[room_id];
        var playerId = room.players[room.currentSlot].id;
        console.log("userID is "+userId+" playerID is "+ playerId);
        if(userId ==  playerId) {
            console.log('calling value:' + callValue);
            room.call(playerId, parseInt(callValue));
            updateTableAndAllPlayers(room);
            publishUndisplayedMessages(room, room_id);
        }

    });

    app.io.route('join', function(req) {
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
        room.selectTrump(playerId, trumpRank, trumpSuit);
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

    app.io.route('showTrump', function(req) {
        var room_id = req.data.roomId;
        var room = rooms[room_id];
        var playerId = room.players[room.currentSlot].id;
        console.log('player requested to show trump:');
        room.showTrump(playerId);
        updateTableAndAllPlayers(room);
        publishUndisplayedMessages(room, room_id);
    }) ;


    function updateTableAndAllPlayers(room) {
        updateTable(room);
        updateAllPlayersWithCards(room);
        updateCurrentPlayerWithCallValues(room);
    }

    function updateTable(room) {
        app.io.room(room.roomId).broadcast('updateTable', getObjectToSendToUser(room));
    }

    function updateCards(room, roomId, slotId) {
        app.io.room(roomId).broadcast('updateCards', getCardsToSendToUser(room, slotId));
    }

    function updateAllPlayersWithCards(room) {
        for(var i = 0; i < room.players.length; i++) {
            if(room.players[i]) {
               updatePlayer(room, room.players[i].id)
            }
        }

    }

    function updateCurrentPlayerWithCallValues(room) {
        console.log('updating popup 1');
        if(room.state == STATES.CALL1 || room.state == STATES.CALL2 || room.state == STATES.CALL3) {
            console.log('updating popup 2');
            var currentSlot = room.currentSlot;
            var roomId = room.roomId + '-' + room.players[currentSlot].id;
            app.io.room(roomId).broadcast('updateCallPopup', {nextAllowedCallValue: room.nextAllowedCallValue});
        }
    }

    function updatePlayer(room, playerId) {
        var roomId = room.roomId + '-' + playerId;
        var currentSlot = room.currentSlot;
        if(room.players[currentSlot] && room.players[currentSlot].id == playerId) {
            updateCards(room, roomId, currentSlot);

        } else {
            for(var i = 0; i < room.players.length; i++) {
                if(room.players[i] && room.players[i].id == playerId) {
                    updateCards(room, roomId,  i);
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

    function publishAllMessages(room, room_id) {
            for (var i = 0; i < room.messageId; i++) {
                app.io.room(room_id).broadcast('updateMessage', room.messages[i]);
            }
    }

    function getCardsToSendToUser(room, slotId) {
        var cardDeckView = new CardDeckView(room, slotId);

        var enableShowTrumpButton = room.currentRoundPlays > 0 && room.ifIDoNotHaveTheCurrentSuit(cardDeckView.cards);
        return { cards: cardDeckView, state: room.state , trumpShown: room.trumpShown, enableShowTrumpButton: enableShowTrumpButton};
    }

    function getObjectToSendToUser(room) {
        return { room: room, view: new RoomView(room) };
    }

};