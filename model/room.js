var Card = require('./card');
var Deck  = require('./deck');
var Game =   require('./game');
var Player = require('./player');

var Room = function Room(roomId) {
    //private
    this.players = [];
    var STATES = {
        WAIT:  {id: 0, message: 'Waiting for players to join'},
        READY: {id: 1, message: 'Press start game to start the game'},
        CALL1: {id: 2, message: 'Waiting for players to call(Round1)'},
        CALL2: {id: 3, message: 'Waiting for players to call(Round1)'},
        CALL3: {id: 4, message: 'Waiting for players to call(Round1)'},
        PLAY:  {id: 5, message: 'Game in progress'},
        END:   {id: 6, message: 'Game has ended'}
    };



    //public
    this.roomId = roomId;
    this.game = new Game();
    this.state =  STATES.WAIT;
    console.log('deck created'+this.game.deck);
    function distribute4CardsToEveryPlayer(deck, players) {
        debugger;
        for(var j=0; j<4;j++) {
            for(var i=0; i<4;i++) {
                var card = deck.pop();
                players[j].addCard(card);
            }
        }

    }

    this.addPlayer = function(playerId, slot) {
        var length = this.players.length;
//        debugger;
        if(this.state == STATES.WAIT && length < 4)  {
            if(!this.players[slot]) {
                console.log('Adding player '+playerId+ ' at slot ' + slot);
                this.players[slot]  = new Player(playerId);
                length++;
                if(length == 4) {
                    this.state = STATES.READY;
                }
            }
        }
    }
    this.addPlayer('1',0);
    this.addPlayer('2',1);
    this.addPlayer('3',2);
    this.addPlayer('4',3);

    this.start = function() {
       if(this.state == STATES.READY && this.players.length == 4) {
           distribute4CardsToEveryPlayer(this.game.deck, this.players);
           this.state = STATES.CALL1;
       }
    }

}

Room.prototype.toString = function toString() {
    return this.game.toString;
}

module.exports = Room;