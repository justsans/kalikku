var Room = require('../../model/room');
var STATES = require('../../model/states');
describe("Room", function () {
    var room;
    beforeEach(function () {
        room = new Room('roomid');
    });

    it("should create a room with zero players and in wait state", function () {

        expect(room.state).toEqual(STATES.WAIT);
        expect(room.findNumberOfActivePlayers()).toEqual(0);
    })

    it("should be able to add players", function () {

        expect(room.findNumberOfActivePlayers()).toEqual(0);
        room.addPlayer('0', 0, 'Player 0');
        expect(room.findNumberOfActivePlayers()).toEqual(1);
        room.addPlayer('1', 1, 'Player 1');
        room.addPlayer('2', 2, 'Player 2');
        room.addPlayer('3', 3, 'Player 3');
        expect(room.findNumberOfActivePlayers()).toEqual(4);
        expect(room.state).toEqual(STATES.READY);
    })

    it("should be able to start game", function () {

        room.addPlayer('0', 0, 'Player 0');
        room.addPlayer('1', 1, 'Player 1');
        room.addPlayer('2', 2, 'Player 2');
        room.addPlayer('3', 3, 'Player 3');
        expect(room.state).toEqual(STATES.READY);
        room.start();
        expect(room.state).toEqual(STATES.CALL1);
        expect(room.players[0].cards.length).toEqual(4);
        expect(room.game.deck.cards.length).toEqual(16);
    })

});
