var Card  = require('./card');

var Deck  = function Deck(cardString) {
	this.cardString = cardString;
	function extractCards(cardString) {
		var index = 0;
		var cards = [];
		while(index < cardString.length) {
			cards.push(new Card(cardString[index], cardString[index+1]));
			index = index + 2;
		}
		return cards;
	}
	
	this.length = cardString.length;
	if(this.length %2 != 0) {
			throw new Error('Invalid Deck String');
	}
	this.cards = extractCards(cardString);
	this.shuffle = function() {
		var length = this.cards.length;
		console.log('cards length='+length);
		for(var i = 0;i < 5; i++) {
			for(var j=0; j<length; j++) {
				var k = Math.floor(Math.random() * length);
				temp = this.cards[j];
				this.cards[j] = this.cards[k];
				this.cards[k] = temp;
			}
		}   
	};
    this.pop = function() {
        return this.cards.pop();
    }
}

Deck.prototype.toString = function toString() {
	return this.cardString;
}

module.exports = Deck;