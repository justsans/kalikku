
var CardDeckView = function CardDeckView(room, slotId) {
    this.roomId = room.roomId;
    this.cards = [];
    this.playerId = '';
    if(room.players[slotId]) {
        this.playerId = room.players[slotId].id;
        this.cards = room.players[slotId].cards;
    }

}

CardDeckView.prototype.toString = function toString() {
    return this.CardDeckView.cards.toString;
}

module.exports = CardDeckView;