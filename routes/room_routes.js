var Room = require ('../model/room');

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
        console.log('showing game:' + room_id);
        var room = rooms[room_id];
        req.io.join(room_id);
        app.io.room(room_id).broadcast('updateTable', { roomId: room_id, room: room } );
        app.io.room(room_id).broadcast('updateMessage', {'message' : 'table shown'}  );
    })

    app.get( "/room/:id", function( req, res ) {
        var room_id = req.params.id;
        console.log('fetching room id: ' + room_id);
        var room = rooms[room_id];
        //req.io.join(room_id);
        res.send( { roomId: room_id, room: room } );
    });


    app.io.route('startGame', function(req) {
        var room_id = req.data.roomId;
        console.log('starting game:' + room_id);
        var room = rooms[room_id];

        room.start();

        app.io.room(room_id).broadcast('updateTable', { roomId: room_id, room: room });
    });

    app.io.route('call', function(req) {
        var room_id = req.data.roomId;
        var callValue = req.data.callValue;
        console.log('calling value:' + callValue);

        var room = rooms[room_id];
        var playerId = room.players[room.currentSlot].id;
        room.call(playerId, parseInt(callValue));
        app.io.room(room_id).broadcast('updateTable', { roomId: room_id, room: room });
        publishUndisplayedMessages(room, room_id);

    });

    app.io.route('selectTrump', function(req) {
        var room_id = req.data.roomId;
        var trumpSuit = req.data.suit;
        var trumpRank = req.data.rank;
        console.log('trump value:' + trumpSuit);

        var room = rooms[room_id];
        var playerId = room.players[room.currentSlot].id;
        room.selectTrump(playerId, trumpSuit, trumpRank);
        app.io.room(room_id).broadcast('updateTable', { roomId: room_id, room: room });
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
        app.io.room(room_id).broadcast('updateTable', { roomId: room_id, room: room });
        publishUndisplayedMessages(room, room_id);
    }) ;

    function publishUndisplayedMessages(room, room_id) {
        if (room.displayedMessageId < room.messageId) {
            for (var i = room.displayedMessageId + 1; i < room.messageId; i++) {
                app.io.room(room_id).broadcast('updateMessage', room.messages[i]);
                room.displayedMessageId = i;
            }
        }
    }

};