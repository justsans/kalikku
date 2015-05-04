var CardDeckView = require('../../model/cardDeckView');
var Room = require('../../model/room');
var Simulator = require('../util/simulatorUtil')

describe("CardDeckView", function () {
    var cardDeckView;
    var room;
    var simulator;

    beforeEach(function () {
        room = new Room('roomid');

    });

    it("should populate cards for players at slot 0", function () {

        simulator = new Simulator();
        simulator.addPlayersAndStartGame(room);

        cardDeckView = new CardDeckView(room, 0);
        expect(cardDeckView.cards).toEqual(room.players[0].cards);
    });

    it("should populate cards for players at slot 1", function () {

        simulator = new Simulator();
        simulator.addPlayersAndStartGame(room);

        cardDeckView = new CardDeckView(room, 1);
        expect(cardDeckView.cards).toEqual(room.players[1].cards);
    });

    it("should populate cards for players at slot 2", function () {

        simulator = new Simulator();
        simulator.addPlayersAndStartGame(room);

        cardDeckView = new CardDeckView(room, 2);
        expect(cardDeckView.cards).toEqual(room.players[2].cards);
    });

    it("should populate cards for players at slot 3", function () {

        simulator = new Simulator();
        simulator.addPlayersAndStartGame(room);

        cardDeckView = new CardDeckView(room, 3);
        expect(cardDeckView.cards).toEqual(room.players[3].cards);
    });

});