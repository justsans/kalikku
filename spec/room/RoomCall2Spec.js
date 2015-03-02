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

        //call round 1
        simulator.callCALL1(room);


    });

    it("should not be able to call in round 2 19 or below", function () {
        expect(STATES.CALL2).toEqual(room.state);
        expect(0).toEqual(room.currentSlot);
        expect(20).toEqual(room.nextAllowedCallValue);
        debugger;
        room.call('0',19);
        expect(0).toEqual(room.currentTrumpSlot);
        expect(14).toEqual(room.currentCallValue);
        expect(1).toEqual(room.currentSlot);
        room.call('1',20);
        expect(1).toEqual(room.currentTrumpSlot);
        expect(20).toEqual(room.currentCallValue);
        expect(2).toEqual(room.currentSlot);

    })


    it("should be able to call in round 2 20 or above", function () {
        expect(STATES.CALL2).toEqual(room.state);
        expect(0).toEqual(room.currentRoundStartSlot);
        expect(0).toEqual(room.currentSlot);
        room.call('0',0);
        expect(1).toEqual(room.currentSlot);
        room.call('1',21);
        expect(2).toEqual(room.currentSlot);
        expect(21).toEqual(room.currentCallValue);
        expect(1).toEqual(room.currentTrumpSlot);

    })

    it("should be able to pass", function () {
        room.call('0',0);
        room.call('1',0);
        expect(0).toEqual(room.teamWithTrump);
        expect(2).toEqual(room.currentSlot);
        expect(14).toEqual(room.currentCallValue);
        expect(0).toEqual(room.currentTrumpSlot);
    })

    it("should be able to call one round complete", function () {
        room.call('0',20);
        room.call('1',21);
        room.call('2',22);
        room.call('3',23);

        room.call('0',0);
        room.call('1',0);
        room.call('2',0);
        expect(3).toEqual(room.currentRoundPasses);
        room.call('3',0);

        expect(STATES.TRUMP1).toEqual(room.state);
        expect(3).toEqual(room.currentSlot);
        expect(23).toEqual(room.currentCallValue);
        expect(3).toEqual(room.currentTrumpSlot);

    })

    it("should be able to pass one round complete", function () {
        room.call('0',0);
        room.call('1',0);
        room.call('2',0);
        room.call('3',0);
        expect(STATES.TRUMP1).toEqual(room.state);
        expect(0).toEqual(room.currentSlot);
        expect(14).toEqual(room.currentCallValue);
        expect(0).toEqual(room.currentTrumpSlot);

    })

    it("should be able to select a trump", function () {

        expect(STATES.CALL2).toEqual(room.state);
        expect(0).toEqual(room.currentTrumpSlot);
        expect(0).toEqual(room.currentRoundCalls);

        //call round 2
        room.call('0',0);
        room.call('1',0);
        room.call('2',0);
        room.call('3',0);

        expect(STATES.TRUMP1).toEqual(room.state);
        expect(0).toEqual(room.currentTrumpSlot);
        expect(24).toEqual(room.nextAllowedCallValue);
        expect(0).toEqual(room.teamWithTrump);
        expect(0).toEqual(room.currentSlot);

        room.selectTrump('0', 'A', 'S');

        expect(STATES.CALL3).toEqual(room.state);
        expect(room.currentSlot).toEqual(room.currentRoundStartSlot);
        expect(24).toEqual(room.nextAllowedCallValue);
        expect('S').toEqual(room.trumpSuit);
    })

    it("should ignore all calls in select trump state.", function () {
        //call round 2
        room.call('0',0);
        room.call('1',0);
        room.call('2',0);
        room.call('3',0);

        expect(STATES.TRUMP1).toEqual(room.state);
        expect(0).toEqual(room.currentTrumpSlot);
        expect(24).toEqual(room.nextAllowedCallValue);
        expect(0).toEqual(room.teamWithTrump);
        expect(0).toEqual(room.currentSlot);

        room.call('0',25);
        room.call('1',26);

        expect(STATES.TRUMP1).toEqual(room.state);
        expect(0).toEqual(room.currentTrumpSlot);
        expect(24).toEqual(room.nextAllowedCallValue);
        expect(0).toEqual(room.teamWithTrump);
        expect(0).toEqual(room.currentSlot);
    })


});
