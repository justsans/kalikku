var Card = require('../model/card');
describe("Card", function() {
  beforeEach(function() {
    
  });

  it("should be able to get Rank and Suit in a card", function() {
    var card = new Card('8', 'S');
    expect(card.rank).toEqual('8');
	expect(card.suit).toEqual('S');
  });

  it("should be able to create multiple cards", function() {
	    var card = new Card('8', 'S');
	    var card1 = new Card('9', 'H');
		expect(card.rank).toEqual('8');
		expect(card.suit).toEqual('S');
	    expect(card1.rank).toEqual('9');
		expect(card1.suit).toEqual('H');
  });

});
