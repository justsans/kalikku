var Card = require('./card');

var CardDeckView = function CardDeckView(room, slotId) {
    this.roomId = room.roomId;
    this.cards = [];
    this.playerId = '';
    if(room.players[slotId]) {
        this.playerId = room.players[slotId].id;
        for(i in room.players[slotId].cards) {
            this.cards.push(new Card(room.players[slotId].cards[i].rank, room.players[slotId].cards[i].suit));
        }
        //this.cards = room.players[slotId].cards;
    }
    if(slotId ==  room.currentTrumpSlot && !room.trumpShown) {
        hideTrumpCard(this.cards, room.trump);
    }

    function hideTrumpCard(cards, trump) {
        if(cards && cards.length > 1 && trump) {
            for(var i=0;i<cards.length;i++) {
                if(cards[i].suit == trump.suit && cards[i].rank == trump.rank) {
                    cards[i].rank = 'N';
                    cards[i].suit = 'A';

                }
            }
        }
    }

}

CardDeckView.prototype.toString = function toString() {
    return this.CardDeckView.cards.toString;
}

module.exports = CardDeckView;