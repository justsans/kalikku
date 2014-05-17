var Card = require('./card');
var Deck  = require('./deck');

var Game = function Game() {
	var _default_suits = ['S','C','D','H'];
	var _default_ranks = ['7','8','Q','K','T','A','9','J'];
	var _initCards = getInitCards(_default_suits, _default_ranks);
	this.deck = new Deck(_initCards);
	function getInitCards(suits, ranks) {
		var cardString = '';
		for(var suit in suits) {
			for(var rank in ranks) {
				cardString += ranks[rank] + suits[suit];
			}
		}
		return cardString;
	}
	this.deck.shuffle();
}

Game.prototype.toString = function toString() {
    return this.deck.toString;
}

module.exports = Game;