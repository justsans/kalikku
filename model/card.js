
var Card = function Card (rank, suit) {
	this.rank = rank;
	this.suit = suit;
	this.point = 1;	
}

Card.prototype.toString = function toString() {
	return this.rank + this.suit;
}

module.exports = Card;