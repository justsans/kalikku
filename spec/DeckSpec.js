var Deck = require('../model/deck');

describe("Deck", function() {
  var deck;

  beforeEach(function() {
    
  });

  it("should throw error if card string is invalid", function() {
	expect(function(){new Deck('8');}).toThrow(new Error('Invalid Deck String'));
  });

  it("should create a deck with one card", function() {
	deck = new Deck('8S');
	expect(1).toEqual(deck.cards.length);
	expect('8').toEqual(deck.cards[0].rank);
	expect('S').toEqual(deck.cards[0].suit);
  });

  it("should create a deck with two cards", function() {
	deck = new Deck('JS7D');
	expect(2).toEqual(deck.cards.length);
	expect('J').toEqual(deck.cards[0].rank);
	expect('S').toEqual(deck.cards[0].suit);
	expect('7').toEqual(deck.cards[1].rank);
	expect('D').toEqual(deck.cards[1].suit);
  });

  it("should shuffle the cards in the deck", function() {
	deck = new Deck('JS7DAH8D9C');
	var oldCard1 = deck.cards[0];
	expect('J').toEqual(oldCard1.rank);
	deck.shuffle();
	expect(5).toEqual(deck.cards.length);
  });

  it("should pop cards from deck", function() {
    deck = new Deck('JS7D');
    expect(2).toEqual(deck.cards.length);
    var card = deck.pop();
    expect('7').toEqual(card.rank);
    expect('D').toEqual(card.suit);
    expect(1).toEqual(deck.cards.length);

    card = deck.pop();
    expect('J').toEqual(card.rank);
    expect('S').toEqual(card.suit);
    expect(0).toEqual(deck.cards.length);

    card = deck.pop();
    expect(null).toEqual(card);

  });

});
