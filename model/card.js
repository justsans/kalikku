
var Card = function Card (rank, suit) {
	this.rank = rank;
	this.suit = suit;
	this.point = calculatePoints(rank);
    this.order = calculateOrder(rank);
    this.displayText = getDisplayRankText(rank) + ' of ' + getDisplaySuitText(suit);
    this.suitOrder = getSuitOrder(suit);

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

    function getDisplayRankText(rank) {
        switch (rank) {
            case '7':
                return 'Seven';
            case '8':
                return 'Eight';
            case 'Q':
                return 'Queen';
            case 'K':
                return 'King';
            case 'T':
                return 'Ten';
            case 'A':
                return 'Ace';
            case  '9':
                return 'Nine';
            case  'J':
                return 'Jack';
            default:
                return '';
        }
    }

    function getDisplaySuitText(suit) {
        switch (suit) {
            case 'S':
                return 'Spades';
            case 'D':
                return 'Diamond';
            case 'C':
                return 'Clubs';
            case 'H':
                return 'Hearts';
            default:
                return '';
        }
    }

    function getSuitOrder(suit) {
        switch (suit) {
            case 'S':
                return 1;
            case 'D':
                return 2;
            case 'C':
                return 3;
            case 'H':
                return 4;
        }
    }
}

Card.prototype.toString = function toString() {
	return this.rank + this.suit;
}

module.exports = Card;