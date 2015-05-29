var Room = require ('../model/room');
var User = require('../model/user');
var STATES = require('../model/states');
var RoomView = require('../model/roomView');
var CardDeckView = require('../model/cardDeckView');
var ObjectId = require('mongoose').Types.ObjectId;
var Simulator = require('../spec/util/simulatorUtil');
var User       		= require('../model/user');
var cookie = require('cookie');

module.exports = function (app, rooms, io, sessionStore) {
    this.sessionStore = sessionStore;
    app.get( "/rooms", function( req, res ) {
        var arr = [];
        for ( var room_id in rooms ) {
            arr.push( rooms[room_id] );
        }
        var user = null;
        if(req.isAuthenticated()) {
            user = req.user.data;
        }

        User.find(function (err, users) {
            res.send( { rooms: arr, authenticated: req.isAuthenticated(), user: user, allUsers: users } );
        }).select('data').sort('-data.profilePoints').limit(10);

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



    app.get( "/rooms/:id", function( req, res ) {
        var room_id = req.params.id;
        console.log('fetching room id: ' + room_id);
        var room = rooms[room_id];
        res.send( getObjectToSendToUser(room) );
    });

    app.get( "/showRoom/:id", function( req, res ) {
        var room_id = req.params.id;
        console.log("oh gooly gooly i am here+ "+ room_id);
        if(req.isAuthenticated()) {
            res.redirect('/room.html?roomId='+room_id);
        } else {
            res.redirect('/login');

        }
    });


    function updateTableAndAllPlayers(room) {
        updateTable(room);
        updateAllPlayersWithCards(room);
        updateCurrentPlayerWithCallValues(room);
    }

    function updateTable(room) {
        io.sockets.in(room.roomId).emit('updateTable', getObjectToSendToUser(room));
    }

    function updateCards(room, roomId, slotId) {
        io.sockets.in(roomId).emit('updateCards', getCardsToSendToUser(room, slotId));
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
            io.sockets.in(roomId).emit('updateCallPopup', {nextAllowedCallValue: room.nextAllowedCallValue});
        }
    }

    function updatePlayer(room, playerId, io) {
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
            for (var i = room.displayedMessageId + 1; i <= room.messageId; i++) {
                if(room.messages[i]) {
                    io.sockets.in(room_id).emit('updateMessage', {id: i, messageText: room.messages[i]});
                }
            }
            room.displayedMessageId = room.messageId;
        }
    }

    function publishUndisplayedChatMessages(room, room_id) {
        console.log("I am here x1:  displayedChatId=" + room.displayedChatId + "  room.chatId="+ room.chatId );
        if (room.displayedChatId < room.chatId) {
            for (var i = room.displayedChatId + 1; i <= room.chatId; i++) {
                io.sockets.in(room_id).emit('updateChat', room.chats[i]);

            }
            room.displayedChatId = room.chatId;
        }
    }

    function publishAllMessages(room, room_id) {
            for (var i = 0; i < room.messageId; i++) {
                io.sockets.in(room_id).emit('updateMessage', {id: i, messageText: room.messages[i]});
            }
    }

    function getCardsToSendToUser(room, slotId) {
        var cardDeckView = new CardDeckView(room, slotId);

        var enableShowTrumpButton = room.currentRoundPlays > 0 && room.ifIDoNotHaveTheCurrentSuit(cardDeckView.cards);
        return { cards: cardDeckView, state: room.state , trumpShown: room.trumpShown, enableShowTrumpButton: enableShowTrumpButton};
    }

    function getObjectToSendToUser(room) {
        return { view: new RoomView(room) };
    }
    ///socket stuff
    io.sockets.on('connection', function (socket) {
        console.log('socket connected');

        socket.on("callback", function(){
            console.log('########I am in callback');
            console.log(socket.handshake.user); //Fetch Logged in user's Id
        })

        socket.on('disconnect', function () {
            console.log('socket disconnected');
        });

        socket.emit('text', 'wow. such event. very real time.');

        socket.on('/room/show', function(req) {

            var room_id = req.roomId;
            var room = rooms[room_id];
            socket.join(room_id);
            updateTable(room);
            var sid = cookie.parse(socket.handshake.headers.cookie)['connect.sid'];
            sessionStore.get(sid.split('.')[0].split(':')[1], function (err, session) {
                if (session.passport.user) {
                    var userId = session.passport.user.id;
                    console.log('showing game:' + room_id + ',' + userId);
                    var new_room_id = room_id + '-' + userId;
                    console.log('Joiningg ROOM: '+new_room_id);
                    socket.join(new_room_id);
                    updatePlayer(room, userId);
                    updateCurrentPlayerWithCallValues(room);
                } else {
                    console.log('io found no user');
                }
            });
            publishAllMessages(room, room_id);
        });

        socket.on('join', function(req) {
            var room_id = req.roomId;
            var slotId = req.slotId;
            var sid = cookie.parse(socket.handshake.headers.cookie)['connect.sid'];
            sessionStore.get(sid.split('.')[0].split(':')[1], function (err, session) {
                if (session.passport.user) {
                    var userId = session.passport.user.id;
                    User.findOne({'_id': new ObjectId(userId)}, function(err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            console.log('User requested to join table:' + userId);
                            socket.join(room_id + '-' + userId);
                            var room = rooms[room_id];
                            if(!room.players[slotId]) {
                                room.addPlayer(userId, slotId, user.data.displayName, user.data.picture);
                            }

                            updateTable(room);
                            publishUndisplayedMessages(room, room_id);
                        }

                    });
                } else {
                    console.log('io found no user');
                }
            });
        });

        socket.on('startGame', function(req) {
            var room_id = req.roomId;
            console.log('starting game:' + room_id);
            var room = rooms[room_id];

            room.start();
            //var simulator = new Simulator();
            //simulator.callAndSelectTrumpWithPlayerId(room, '553a97c9ffd561c00e44c28c');

            updateTableAndAllPlayers(room);


        });


        socket.on('chat', function(req) {
            var room_id = req.roomId;
            var chatMessage = req.message;

            var sid = cookie.parse(socket.handshake.headers.cookie)['connect.sid'];
            sessionStore.get(sid.split('.')[0].split(':')[1], function (err, session) {
                if (session.passport.user) {
                    var userId = session.passport.user.id;
                    console.log('got chat message: '+chatMessage + ' from ' + userId);
                    var room = rooms[room_id];

                    var playerName = 'Anonymous';
                    User.findOne({'_id': new ObjectId(userId)}, function(err, user) {
                        if(user) {
                            playerName = user.data.displayName;
                        }
                        room.addChatMessage(playerName, chatMessage);
                        publishUndisplayedChatMessages(room, room_id);
                    });

                } else {
                    console.log('io found no user');
                }
            });


        });

        socket.on('call', function(req) {
            var room_id = req.roomId;
            var callValue = req.callValue;

            var sid = cookie.parse(socket.handshake.headers.cookie)['connect.sid'];
            sessionStore.get(sid.split('.')[0].split(':')[1], function (err, session) {
                if (session.passport.user) {
                    var userId = session.passport.user.id;
                    var room = rooms[room_id];
                    console.log(userId + ' called');
                    if(room.players[room.currentSlot]) {
                        console.log('detected player at slot ' + room.currentSlot + ',' + room.players[room.currentSlot]);
                        var playerId = room.players[room.currentSlot].id;
                        if(userId ==  playerId) {
                            console.log('calling value:' + callValue);
                            room.call(playerId, parseInt(callValue));
                            updateTableAndAllPlayers(room);
                            publishUndisplayedMessages(room, room_id);
                        }
                    }
                } else {
                    console.log('io found no user');
                }
            });

        });

        socket.on('showTrump', function(req) {
            var room_id = req.roomId;
            var room = rooms[room_id];
            var playerId = room.players[room.currentSlot].id;
            console.log('player requested to show trump:');
            room.showTrump(playerId);
            updateTableAndAllPlayers(room);
            publishUndisplayedMessages(room, room_id);
        }) ;

        socket.on('play', function(req) {
            var room_id = req.roomId;
            var suit = req.suit;
            var rank = req.rank;
            console.log('card played:' + suit+rank);

            var room = rooms[room_id];
            var playerId = room.players[room.currentSlot].id;
            room.play(playerId, rank, suit);
            updateTableAndAllPlayers(room);
            setTimeout(function() {
                room.finishRoundIfDone();
                updateTableAndAllPlayers(room);
                publishUndisplayedMessages(room, room_id);
            }, 3000);

            publishUndisplayedMessages(room, room_id);
        }) ;

        socket.on('selectTrump', function(req) {
            var room_id = req.roomId;
            var trumpSuit = req.suit;
            var trumpRank = req.rank;
            console.log('trump value:' + trumpSuit);

            var room = rooms[room_id];
            var playerId = room.players[room.currentSlot].id;
            room.selectTrump(playerId, trumpRank, trumpSuit);
            updateTableAndAllPlayers(room);
            publishUndisplayedMessages(room, room_id);
        }) ;

        socket.on('eject', function(req) {
            var room_id = req.roomId;
            var slotId = req.slotId;
            console.log('ejecting slot:' + slotId);

            var room = rooms[room_id];
            var playerId = room.players[slotId].id;
            if(playerId) {
                room.ejectPlayer(slotId, playerId);
                updateTableAndAllPlayers(room);
                publishUndisplayedMessages(room, room_id);
                console.log('ejected slot:' + slotId);
            }
        }) ;


    });


};