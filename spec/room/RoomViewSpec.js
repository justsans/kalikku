var RoomView = require('../../model/roomView');
var Room = require('../../model/room');
var Simulator = require('../util/simulatorUtil')

describe("RoomView", function () {
    var roomView;
    var room;
    var simulator;

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
    });

});
