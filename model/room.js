var Card = require('./card');
var Deck  = require('./deck');
var Game =   require('./game');
var Player = require('./player');
var STATES = require('./states');

var Room = function Room(roomId, isDefaultAddPlayer) {
    //private
    var NO_PLAYERS = 4;
    this.players = [null,null,null,null];
    this.currentRoundStartSlot = 0;
    this.currentSlot = 0;
    this.currentCallValue = 13;
    this.nextAllowedCallValue = 14;
    this.currentTrumpSlot = 0;
    this.currentRoundCalls = 0;
    this.trumpShown = false;
    this.trump = null;
    this.teamWithTrump = 0;
    this.trumpSuit = '';
    this.messages = [];
    this.messageId = 0;
    this.displayedMessageId = 0;
    this.currentRoundPasses = 0;

    this.tableCards = [];
    this.numberOfActivePlayers = 0;


    //public
    this.roomId = roomId;
    this.game = new Game();
    this.state =  STATES.WAIT;
    console.log('deck created'+this.game.deck);
    function distribute4CardsToEveryPlayer(deck, players) {
       // debugger;
        for(var j=0; j<4;j++) {
            for(var i=0; i<4;i++) {
                var card = deck.pop();
                players[j].addCard(card);
            }
        }

    }

    this.findNumberOfActivePlayers = function() {
        var noPlayers = 0;
        for(var i=0; i < this.players.length; i++) {
            var player =  this.players[i];
            if(player) {
                noPlayers = noPlayers + 1;
            }
        }
        return noPlayers;
    }

    this.hasAllPlayersJoined = false;

    this.addPlayer = function(playerId, slot, name) {
        var numberOfPlayers = this.findNumberOfActivePlayers();
//        debugger;
        if(this.state == STATES.WAIT && !this.hasAllPlayersJoined)  {
            if(!this.players[slot]) {
                console.log('Adding player '+playerId+ ' at slot ' + slot);
                this.messages[this.messageId++] = name + ' joined the table.';
                this.players[slot]  = new Player(playerId, name);
                numberOfPlayers++;
                this.numberOfActivePlayers = numberOfPlayers;
                if(numberOfPlayers == 4) {
                    this.hasAllPlayersJoined = true;
                    this.state = STATES.READY;
                }
            }
        }
    }


    if(isDefaultAddPlayer) {
        this.addPlayer('0',0, 'Player 0');
        this.addPlayer('1',1, 'Player 1');
        this.addPlayer('2',2, 'Player 2');
        this.addPlayer('3',3, 'Player 3');
    }


    this.start = function() {
       if(this.state == STATES.READY && this.players.length == 4) {
           distribute4CardsToEveryPlayer(this.game.deck, this.players);
           this.state = STATES.CALL1;
           this.currentSlot = this.currentRoundStartSlot;
       }
    }

    this.isCallState = function() {
       if(this.state == STATES.CALL1 || this.state == STATES.CALL2  || this.state == STATES.CALL3 ) {
           return true;
       }
       return false;
    }

    this.play = function(playerId, rank, suit) {
        if(this.state == STATES.PLAY && this.isCardValid(playerId, rank, suit)) {
           this.players[this.currentSlot].removeCardByRankAndSuit(rank, suit);
        }
    }

    this.isCardValid = function(playerId, rank, suit) {
        var currentPlayerId = this.players[this.currentSlot].id;
        debugger;
        if(currentPlayerId == playerId && this.players[this.currentSlot].hasCard(rank, suit)) {
            return true;
        }
        return false;
    }

    this.call = function(playerId, callValue) {
        var currentPlayerId = this.players[this.currentSlot].id;
        if(currentPlayerId == playerId && this.isCallState()) {
            //set min call value
            var minCallValue = this.nextAllowedCallValue ;
            console.log('min call value is: ' + minCallValue);

            if(this.state == STATES.CALL1) {
                if((this.currentTrumpSlot == 0 && this.currentSlot === 2)
                   || (this.currentTrumpSlot === 2 && this.currentSlot === 0)
                   || (this.currentTrumpSlot === 1 && this.currentSlot === 3)
                   || (this.currentTrumpSlot === 3 && this.currentSlot === 1)) {
                     if(minCallValue < 20) {
                         minCallValue = 20;
                     }
                }
            }
            this.oldTrumpSlot = this.currentTrumpSlot;

            if(callValue >= minCallValue)  {
                this.messages[this.messageId++] = this.players[this.currentSlot] + ' called ' + callValue;
                this.currentCallValue =  callValue;
                this.nextAllowedCallValue = callValue + 1;
                this.messages[this.messageId++] = 'Next allowed call value ' + this.nextAllowedCallValue;
                this.currentTrumpSlot = this.currentSlot;
                this.nextSlotAfterCall();

                this.teamWithTrump =  this.currentTrumpSlot % 2;
                console.log('this.teamWithTrump=' +this.teamWithTrump);

            } else if(callValue < this.nextAllowedCallValue && (this.state != STATES.CALL1 || this.currentRoundCalls > 0)) {
                this.messages[this.messageId++] = this.players[this.currentSlot] + ' passed.';
                this.currentRoundPasses++;
                this.nextSlotAfterPass();

            }

            console.log('currentRoundCalls=' + this.currentRoundCalls);
            if(this.state == STATES.CALL1 && this.currentRoundCalls >= 4) {

                this.advanceToNextState();
            }  else if(this.state == STATES.CALL2 && this.currentRoundPasses >= 4) {
                this.advanceToNextState();
            } else if(this.state == STATES.CALL3 && this.currentRoundPasses >= 4) {
                this.advanceToNextState();
            }

            this.messages[this.messageId++] = 'Next turn: ' + this.players[this.currentSlot];

            if(this.currentCallValue == 28) {
                if(this.players[0].cards.length == 4) {
                    distribute4CardsToEveryPlayer(this.game.deck, this.players);
                }
                this.setStateToTrump2();
            }
        }

    }

    this.setStateToPlay = function() {
        this.state = STATES.PLAY;
        this.nextAllowedCallValue = 29;
        this.currentSlot = this.currentRoundStartSlot;
    }

    this.setStateToTrump2 = function() {
        this.messages[this.messageId++] = 'Waiting for player ' + this.currentTrumpSlot + ' to select a trump.';
        this.currentSlot = this.currentTrumpSlot;
        this.state = STATES.TRUMP2;
    }

    this.advanceToNextState = function() {
        console.log('advancing to next state');
        this.currentRoundCalls = 0;
        switch (this.state) {
            case STATES.WAIT:
                this.state = STATES.READY;
                this.currentSlot = this.currentRoundStartSlot;
                break;
            case STATES.READY:
                this.state = STATES.CALL1;
                this.currentRoundPasses = 0;
                this.currentSlot = this.currentRoundStartSlot;
                break;
            case STATES.CALL1:
                this.state = STATES.CALL2;
                this.currentRoundPasses = 0;
                this.currentRoundCalls =0;
                this.currentSlot = this.currentRoundStartSlot;
                if(this.nextAllowedCallValue < 20) {this.nextAllowedCallValue = 20;}
                break;
            case STATES.CALL2:
                this.messages[this.messageId++] = 'Waiting for player ' + this.currentTrumpSlot + ' to select a trump.';
                this.state = STATES.TRUMP1;
                this.currentSlot = this.currentTrumpSlot;
                this.currentRoundCalls = 0;
                if(this.nextAllowedCallValue < 24) {this.nextAllowedCallValue = 24;}
                break;
            case STATES.TRUMP1:
                this.currentRoundCalls = 0;
                this.state = STATES.CALL3;
                this.currentRoundPasses = 0;
                this.currentSlot = this.currentRoundStartSlot;
                distribute4CardsToEveryPlayer(this.game.deck, this.players);
                break;
            case STATES.CALL3:
                if(this.call  >= 24) {
                    this.setStateToTrump2();
                } else {
                    this.setStateToPlay();
                }

                break;
            case STATES.TRUMP2:
                this.setStateToPlay();
                break;
            case STATES.END:
                this.state = STATES.READY;
                this.currentRoundCalls = 0;
                this.nextAllowedCallValue = 14;
                this.trumpShown = false;
                this.trumpSuit = '';
                this.currentCallValue = 13;
                this.currentRoundPasses = 0;
                this.currentRoundStartSlot  = (this.currentRoundStartSlot + 1) % NO_PLAYERS;
                this.currentSlot = this.currentRoundStartSlot;

        }
    }

    this.nextSlotAfterCall =  function () {
        this.currentRoundCalls++;
        console.log('\nthis.currentRoundCalls  is ' + this.currentRoundCalls);
        console.log(this.currentSlot + 'called ' + this.currentCallValue);

        if(this.state == STATES.CALL1) {
            switch(this.currentRoundCalls) {
                case 1: this.currentSlot = (this.currentSlot + 1) % NO_PLAYERS;break;
                case 2: this.currentSlot = (this.currentSlot + 1) % NO_PLAYERS;break;
                case 3: this.currentSlot = (this.oldTrumpSlot + 2) % NO_PLAYERS;break;
            }
        } else {
            this.currentSlot = (this.currentSlot + 1) % NO_PLAYERS;
        }

        console.log('setting current slot to in call :' + this.currentSlot) ;
    }

    this.nextSlotAfterPass = function() {
        console.log(this.currentSlot + 'passed');
        console.log('\nthis.teamWithTrump'  + this.teamWithTrump);
        this.currentRoundCalls++;

        if(this.state == STATES.CALL1) {
            switch(this.currentRoundCalls) {
                case 1: this.currentSlot = (this.currentSlot + 1) % NO_PLAYERS;break;
                case 2: this.currentSlot = (this.currentSlot + 2) % NO_PLAYERS;break;
                case 3: this.currentSlot = (this.oldTrumpSlot + 2) % NO_PLAYERS;break;
            }
        } else {
            this.currentSlot = (this.currentSlot + 1) % NO_PLAYERS;
        }
        console.log('setting current slot to in pass :' + this.currentSlot) ;
    }

    this.selectTrump = function(playerId, rank, suit) {
        var trumpPlayerId = this.players[this.currentTrumpSlot].id;
        if(trumpPlayerId == playerId) {
            this.trump = new Card(rank, suit);
            this.trumpSuit = suit;
            if(this.state == STATES.TRUMP1 || this.state == STATES.TRUMP2) {
                this.advanceToNextState();
            }
            this.messages[this.messageId++] = 'Player ' + this.currentSlot + ' selected a trump.';
        }
    }

}

Room.prototype.toString = function toString() {
    return this.game.toString;
}

module.exports = Room;