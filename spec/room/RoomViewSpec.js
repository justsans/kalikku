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

    it("should populate cards for players at slot 0", function () {

        simulator = new Simulator();
        simulator.addPlayersAndStartGame(room);

        roomView = new RoomView(room, 0);
        expect(roomView.cards).toEqual(room.players[0].cards);
    });

    it("should populate cards for players at slot 1", function () {

        simulator = new Simulator();
        simulator.addPlayersAndStartGame(room);

        roomView = new RoomView(room, 1);
        expect(roomView.cards).toEqual(room.players[1].cards);
    });

    it("should populate cards for players at slot 2", function () {

        simulator = new Simulator();
        simulator.addPlayersAndStartGame(room);

        roomView = new RoomView(room, 2);
        expect(roomView.cards).toEqual(room.players[2].cards);
    });

    it("should populate cards for players at slot 3", function () {

        simulator = new Simulator();
        simulator.addPlayersAndStartGame(room);

        roomView = new RoomView(room, 3);
        expect(roomView.cards).toEqual(room.players[3].cards);
    });

});
