var Card = require('../model/card');
var Player = require('../model/player');

describe("Player", function () {
    var player;

    beforeEach(function () {

    });

    it("should create a player with no cards", function () {
        player = new Player('playerid');
        expect('playerid').toEqual(player.id);
        expect(0).toEqual(player.cards.length);
    });

    it("should be able to add cards to the player", function () {
        player = new Player('playerid');
        expect(0).toEqual(player.cards.length);

        var card1 = new Card('A', 'S');
        player.addCard(card1);
        expect(1).toEqual(player.cards.length);

        var card2 = new Card('J', 'D');
        player.addCard(card2);
        expect(2).toEqual(player.cards.length);

    });

    it("should be able to delete cards to the player", function () {
        player = new Player('playerid');

        var card1 = new Card('A', 'S');
        player.addCard(card1);
        expect(1).toEqual(player.cards.length);

        var card2 = new Card('J', 'D');
        player.addCard(card2);
        expect(2).toEqual(player.cards.length);

        player.removeCard(card1);
        expect(1).toEqual(player.cards.length);

        player.removeCard(card1);
        expect(1).toEqual(player.cards.length);

        player.removeCard(card2);
        expect(0).toEqual(player.cards.length);

        player.removeCard(card1);
        expect(0).toEqual(player.cards.length);
    });

});
