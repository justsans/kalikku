var RoomView = require('../../model/roomView');
var Room = require('../../model/room');
var STATES = require('../../model/states');

describe("RoomView", function () {
    var roomView;
    beforeEach(function () {
        room = new Room('roomid');
    });

    it("should create a roomView with all required room attributes", function () {

        roomView = new RoomView(room);

        expect(roomView.roomId).toEqual(room.roomId);
        expect(roomView.state).toEqual(room.state);
        expect(roomView.hasAllPlayersJoined).toEqual(room.hasAllPlayersJoined);
        expect(roomView.tableCards).toEqual(room.tableCards);
        expect(roomView.nextAllowedCallValue).toEqual(room.nextAllowedCallValue);
    })

});
