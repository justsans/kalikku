
var Card = function Card (rank, suit) {
	this.rank = rank;
	this.suit = suit;
	this.point = calculatePoints(rank);
    this.order = calculateOrder(rank);

    function calculatePoints(rank) {
        if(rank == 'J') return 3;
        if(rank == '9') return 2;
        if(rank == 'A' || rank == 'T') return 1;
        return 0;
    }

    function calculateOrder(rank) {
        switch (rank) {
            case '7':
                return 0;
            case '8':
                return 1;
            case 'Q':
                return 2;
            case 'K':
                return 3;
            case 'T':
                return 4;
            case 'A':
                return 5;
            case  '9':
                return 6;
            case  'J':
                return 7;
            default:
                return -1;
        }
    }
}

Card.prototype.toString = function toString() {
	return this.rank + this.suit;
}

module.exports = Card;