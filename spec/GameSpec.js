var Game = require('../model/game');
describe("Game", function() {
  var game;

  beforeEach(function() {
    
  });

  it("should create a game with a deck of all 32 cards.", function() {
	game = new Game();
	var deck = game.deck;
	expect(32).toEqual(deck.cards.length);
  });

});
