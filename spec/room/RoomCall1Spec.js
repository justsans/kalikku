var Room = require('../../model/room');
var STATES = require('../../model/states');
var Simulator = require('../util/simulatorUtil')

describe("Room", function () {
    var room;
    var simulator;

    beforeEach(function () {
        room = new Room('roomid');

        simulator = new Simulator();
        simulator.addPlayersAndStartGame(room);
    });

    it("should be able to call in round 1", function () {
        expect(STATES.CALL1).toEqual(room.state);
        expect(0).toEqual(room.currentRoundStartSlot);
        expect(0).toEqual(room.currentSlot);
        room.call('0',14);
        expect(1).toEqual(room.currentSlot);
        expect(14).toEqual(room.currentCallValue);
        expect(0).toEqual(room.currentTrumpSlot);

    })

    it("should be able to pass", function () {
        room.call('0',14);
        room.call('1',13);
        expect(0).toEqual(room.teamWithTrump);
        expect(3).toEqual(room.currentSlot);
        expect(14).toEqual(room.currentCallValue);
        expect(0).toEqual(room.currentTrumpSlot);
    })

    it("should be able to call over", function () {
        room.call('0',14);
        room.call('1',15);
        expect(2).toEqual(room.currentSlot);
        expect(15).toEqual(room.currentCallValue);
        expect(1).toEqual(room.currentTrumpSlot);

    })

    it("should be able to call one round complete", function () {
        room.call('0',14);
        room.call('1',15);
        room.call('2',16);
        room.call('3',17);
        expect(0).toEqual(room.currentSlot);
        expect(17).toEqual(room.currentCallValue);
        expect(3).toEqual(room.currentTrumpSlot);
        expect(STATES.CALL2).toEqual(room.state);

    })

    it("should not allow same team to call below 20", function () {
        room.call('0',14);
        room.call('1',13);
        room.call('3',13);
        expect(2).toEqual(room.currentSlot);
        expect(14).toEqual(room.currentCallValue);
        room.call('2',19);
        expect(2).toEqual(room.currentSlot);
        expect(14).toEqual(room.currentCallValue);
        expect(0).toEqual(room.currentTrumpSlot);

        room.call('2',20);
        expect(0).toEqual(room.currentSlot);
        expect(20).toEqual(room.currentCallValue);
        expect(2).toEqual(room.currentTrumpSlot);

    })


    it("should allow the same team to only call 20 and above", function () {
        room.call('0',14);
        expect(1).toEqual(room.currentSlot);
        room.call('1',15);

        expect(2).toEqual(room.currentSlot);
        room.call('2',0);

        expect(3).toEqual(room.currentSlot);
        expect(1).toEqual(room.currentTrumpSlot);
        expect(15).toEqual(room.currentCallValue);

        room.call('3',16);
        expect(1).toEqual(room.currentTrumpSlot);
        expect(15).toEqual(room.currentCallValue);

        room.call('3',20);
        expect(3).toEqual(room.currentTrumpSlot);
        expect(20).toEqual(room.currentCallValue);

    })

    it("should be able to call one round complete and move the state to call2", function () {
        room.call('0',14);
        room.call('1',0);
        room.call('3',0);
        room.call('2',0);
        expect(0).toEqual(room.currentSlot);
        expect(14).toEqual(room.currentCallValue);
        expect(0).toEqual(room.currentTrumpSlot);
        expect(20).toEqual(room.nextAllowedCallValue);

        expect(STATES.CALL2).toEqual(room.state);

    })

});
