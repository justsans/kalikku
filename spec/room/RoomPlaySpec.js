var Room = require('../../model/room');
var STATES = require('../../model/states');
var Simulator = require('../util/simulatorUtil')

describe("Room", function () {
    var room;
    var simulator;


    beforeEach(function () {
        room = new Room('roomid');
        simulator = new Simulator();
        simulator.doAllStepsUntilPlay(room);

    });

    it("should be in state to play with currentSlot as the first player", function () {
        expect(STATES.PLAY).toEqual(room.state);
        expect(0).toEqual(room.currentSlot)
        expect(29).toEqual(room.nextAllowedCallValue);
    });

    it("should be able to play a card in hand", function () {
        expect(8).toEqual(room.players[0].cards.length);
        var card = room.players[0].cards[0];
        room.play('0', card.rank, card.suit);

        expect(7).toEqual(room.players[0].cards.length);

    });

    it("should not be able to play a card not in hand", function () {
        expect(8).toEqual(room.players[0].cards.length);
        var card = room.players[1].cards[0];
        room.play('0', card.rank, card.suit);

        expect(8).toEqual(room.players[0].cards.length);

    });

//    it("should not be able to play trump if trump is not shown and you called trump", function () {
//        expect(8).toEqual(room.players[0].cards.length);
//        room.play('0', room.trump.rank, room.trump.suit);
//
//        expect(8).toEqual(room.players[0].cards.length);
//
//    });

});
