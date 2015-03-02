var Room = require('../../model/room');
var STATES = require('../../model/states');
describe("Room", function () {
    var room;

    beforeEach(function () {
        room = new Room('roomid');
        room.addPlayer('0', 0);
        room.addPlayer('1', 1);
        room.addPlayer('2', 2);
        room.addPlayer('3', 3);

        room.start();

        //call round 1
        room.call('0',14);
        room.call('1',15);
        room.call('2',0);
        room.call('3',0);

        //call round 2
        room.call('0',0);
        room.call('1',0);
        room.call('2',0);
        room.call('3',0);

        expect(STATES.TRUMP1).toEqual(room.state);
        expect(1).toEqual(room.currentTrumpSlot);
        expect(24).toEqual(room.nextAllowedCallValue);
        expect(1).toEqual(room.teamWithTrump);
        expect(1).toEqual(room.currentSlot);

        room.selectTrump('1', 'A', 'S');
        expect(STATES.CALL3).toEqual(room.state);


    });

    it("should be able pass one round", function () {
        expect(1).toEqual(room.currentTrumpSlot);
        expect(24).toEqual(room.nextAllowedCallValue);
        expect(1).toEqual(room.teamWithTrump);
        expect(0).toEqual(room.currentSlot);

        room.call('0',0);
        room.call('1',0);
        room.call('2',0);
        room.call('3',0);

        expect(0).toEqual(room.currentRoundStartSlot);
        expect(room.currentSlot).toEqual(room.currentRoundStartSlot);
        expect(STATES.PLAY).toEqual(room.state);
        expect(29).toEqual(room.nextAllowedCallValue);
    })

    it("should be able call one round", function () {
        expect(1).toEqual(room.currentTrumpSlot);
        expect(24).toEqual(room.nextAllowedCallValue);
        expect(1).toEqual(room.teamWithTrump);
        expect(0).toEqual(room.currentSlot);

        room.call('0',24);
        room.call('1',25);
        room.call('2',26);
        room.call('3',27);

        room.call('0',0);
        room.call('1',0);
        room.call('2',0);
        room.call('3',0);

        expect(0).toEqual(room.currentRoundStartSlot);
        expect(room.currentSlot).toEqual(room.currentRoundStartSlot);
        expect(STATES.PLAY).toEqual(room.state);
        expect(29).toEqual(room.nextAllowedCallValue);
    })

    it("should not ask players to pass after 28 is called", function () {
        expect(1).toEqual(room.currentTrumpSlot);
        expect(24).toEqual(room.nextAllowedCallValue);
        expect(1).toEqual(room.teamWithTrump);
        expect(0).toEqual(room.currentSlot);

        room.call('0',0);
        room.call('1',0);
        room.call('2',28);

        expect(2).toEqual(room.currentTrumpSlot);
        expect(room.currentSlot).toEqual(room.currentTrumpSlot);
        expect(STATES.TRUMP2).toEqual(room.state);
        expect(29).toEqual(room.nextAllowedCallValue);
        expect(0).toEqual(room.teamWithTrump);
    })

});
