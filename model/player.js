var Player = function Player (playerId) {
    this.id = playerId;
    this.cards = [];
    this.addCard  = function(card) {
       if(this.cards.length < 8) {
           this.cards.push(card);
       }
    }

    this.removeCardByRankAndSuit = function(rank, suit) {
        if(this.hasCard(rank, suit)) {
            var card = this.getCard(rank, suit);
            this.removeCard(card);
        }
    }

    this.removeCard  = function(card) {
        if(this.cards.length > 0) {
            var index =  this.cards.indexOf(card);
            if(index >= 0) {
                this.cards.splice(index, 1);
            }
        }
    }

    this.getCard = function(rank, suit) {
        for(var i=0; i < this.cards.length; i++) {

            if(this.cards[i].suit == suit && this.cards[0].rank == rank) {
                return this.cards[i];
            }
        }
        return null;
    }

    this.hasCard = function(rank, suit) {
       for(var i=0; i < this.cards.length; i++) {

           if(this.cards[i].suit == suit && this.cards[0].rank == rank) {
               return true;
           }
       }
       return false;
    }
}

Player.prototype.toString = function toString() {
    return this.id;
}

module.exports = Player;