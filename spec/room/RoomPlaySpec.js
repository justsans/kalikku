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
        expect(0).toEqual(room.currentSlot);
        expect(29).toEqual(room.nextAllowedCallValue);
        expect(1).toEqual(room.playRound);
        expect(0).toEqual(room.currentRoundPlays);
    });

    it("should be able to play a card in hand that is not trump", function () {
        expect(8).toEqual(room.players[0].cards.length);
        var card;
        for(var i =0;i < room.players[0].cards.length; i++) {
            if(room.players[0].cards[i].suit != room.trumpSuit) {
                card = room.players[0].cards[i];
                break;
            }
        }
        room.play('0', card.rank, card.suit);

        expect(7).toEqual(room.players[0].cards.length);
        expect(1).toEqual(room.currentRoundPlays);

    });

    it("should not be able to play a card not in hand", function () {
        expect(8).toEqual(room.players[0].cards.length);
        var card = room.players[1].cards[0];
        expect(0).toEqual(room.currentSlot);
        room.play('0', card.rank, card.suit);

        expect(8).toEqual(room.players[0].cards.length);
        expect(0).toEqual(room.currentRoundPlays);

    });

    it("should not be able to play trump if trump is not shown and you called trump", function () {
        expect(8).toEqual(room.players[0].cards.length);
        room.play('0', room.trump.rank, room.trump.suit);

        expect(8).toEqual(room.players[0].cards.length);
        expect(0).toEqual(room.currentRoundPlays);

    });

    it("should not be able to play another card if suit is available", function () {
        //simulator.setupTestCards1('JH9HAHTH7C8C7D8D  JD9DADTDQDKDQH8S JC9CACTCKCQCKH7S JS9SASTSKSQS8H7H')
        simulator.setupTestCards1(room, 'JH9HAHTH7C8C7D8DJD9DADTDQDKDQH8SJC9CACTCKCQCKH7SJS9SASTSKSQS8H7H');
        expect(8).toEqual(room.players[0].cards.length);

        room.play('0', '8', 'H');

        expect(7).toEqual(room.players[0].cards.length);
        expect(1).toEqual(room.currentRoundPlays);

        room.play('0', '8', 'S');
        expect(8).toEqual(room.players[1].cards.length);
        expect(1).toEqual(room.currentRoundPlays);

    });


});
