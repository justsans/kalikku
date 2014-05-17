var Player = function Player (playerId) {
    this.id = playerId;
    this.cards = [];
    this.addCard  = function(card) {
       if(this.cards.length < 8) {
           this.cards.push(card);
       }
    }

    this.removeCard  = function(card) {
        if(this.cards.length < 8) {
            var index =  this.cards.indexOf(card);
            if(index >= 0) {
                this.cards.splice(index, 1);
            }
        }
    }
}

Player.prototype.toString = function toString() {
    return this.id;
}

module.exports = Player;