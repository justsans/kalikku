var Card = require('./card');
var Deck  = require('./deck');
var Game =   require('./game');
var Player = require('./player');
var STATES = require('./states');
// load up the user model
var User       		= require('./user');
var ObjectId = require('mongoose').Types.ObjectId;

var Room = function Room(roomId, isDefaultAddPlayer) {
    //private
    var NO_PLAYERS = 4;
    this.players = [null,null,null,null];
    this.currentRoundStartSlot = 0;
    this.currentSlot = 0;
    this.currentCallValue = 13;
    this.nextAllowedCallValue = 14;
    this.currentTrumpSlot = 0;
    this.currentTrumpPlayerName = '';
    this.currentRoundCalls = 0;
    this.trumpShown = false;
    this.trump = null;
    this.teamWithTrump = 0;
    this.trumpSuit = '';
    this.messages = [];
    this.messageId = 0;
    this.displayedMessageId = -1;
    this.chats = [];
    this.chatId = -1;
    this.displayedChatId = -1;
    this.currentRoundPasses = 0;
    this.stateBeforeHold = STATES.READY;

    this.playRound = 1;
    this.currentPlayRoundSuit = '';
    this.currentRoundPlays = 0;
    this.currentPlayRoundStartSlot = 0;
    this.team1Points = 0;
    this.team2Points = 0;
    this.team2GamePoints = 6;
    this.team1GamePoints = 6;

    this.tableCards = [];
    this.lastRoundCards = [];
    this.numberOfActivePlayers = 0;


    //public
    this.roomId = roomId;
    this.game = new Game();
    this.state =  STATES.WAIT;
    console.log('deck created'+this.game.deck);

    this.initAfterEachGame = function() {
        this.trump = null;
        this.trumpSuit = '';
        this.playRound = 1;
        this.tableCards = [];
        this.team1Points = 0;
        this.team2Points = 0;
        this.teamWithTrump = 0;
        this.game = new Game();
        this.trumpShown = false;
        this.currentTrumpSlot = 0;
        this.currentRoundPlays = 0;
        this.currentCallValue = 13;
        this.currentRoundCalls = 0;
        this.currentRoundPasses = 0;
        this.nextAllowedCallValue = 14;
        this.currentTrumpPlayerName = '';
        for(var j=0; j<4;j++) {
            this.players[j].cards = [];
        }
    }

    function distribute4CardsToEveryPlayer(deck, players) {
        for(var j=0; j<4;j++) {
            for(var i=0; i<4;i++) {
                var card = deck.pop();
                players[j].addCard(card);
            }
        }
        for(var j=0; j<4;j++) {
            sortPlayerCardsBySuit(players[j].cards);
        }

    }

    function sortPlayerCardsBySuit(cards) {
        cards.sort(compareCards);
    }

    function compareCards(card1, card2) {
        if(card1.suit < card2.suit) {
            return 1;
        } else if(card1.suit ==  card2.suit) {
            if(card1.order < card2.order) {
                return 1;
            }else if(card1.order == card2.order){
                return 0;
            }
        }

        return -1;
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

    this.addPlayer = function(playerId, slot, name, picture) {
        var numberOfPlayers = this.findNumberOfActivePlayers();
        if((this.state == STATES.WAIT || this.state == STATES.HOLD) && !this.hasAllPlayersJoined)  {
            if(!this.players[slot]) {
                console.log('Adding player '+playerId+ ' at slot ' + slot);
                this.messages[this.messageId++] = name + ' joined the table.';
                this.players[slot]  = new Player(playerId, name, picture);
                numberOfPlayers++;

                if(numberOfPlayers == 4) {
                    this.hasAllPlayersJoined = true;
                    this.state = this.stateBeforeHold;

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
           this.initAfterEachGame();
           distribute4CardsToEveryPlayer(this.game.deck, this.players);
           this.state = STATES.CALL1;
           this.currentSlot = this.currentRoundStartSlot;
           this.currentPlayRoundStartSlot = this.currentRoundStartSlot;
       }
    }

    this.isCallState = function() {
       if(this.state == STATES.CALL1 || this.state == STATES.CALL2  || this.state == STATES.CALL3 ) {
           return true;
       }
       return false;
    }

    this.play = function(playerId, rank, suit) {
        console.log(rank+ suit +' played');
        if(this.state == STATES.PLAY && this.isCardValid(playerId, rank, suit)) {
           console.log(rank+ suit +' is valid');
           this.players[this.currentSlot].removeCardByRankAndSuit(rank, suit);
           this.tableCards[this.currentSlot] = new Card(rank, suit);

           console.log('currentRoundPlays = ' + this.currentRoundPlays);
            if(this.currentRoundPlays == 0) {
                this.currentPlayRoundSuit = suit;
                console.log('currentPlayRoundSuit = ' + this.currentPlayRoundSuit);
            }
            if(this.currentRoundPlays <= 3) {
                this.currentRoundPlays++;
                if(this.currentRoundPlays < 4) {
                    this.currentSlot = (this.currentSlot + 1) % NO_PLAYERS;
                } else {
                    console.log('putting state to finalize');
                    this.state = STATES.FINALIZE;
                }
            }
        }
    }

    this.finishRoundIfDone = function() {
        if(this.currentRoundPlays >= 4) {
            this.state = STATES.PLAY;
            this.finishRound();
        }
    }

    this.ejectPlayer = function(slotId, playerId) {
        console.log('ejecting player at slot played');
        if(playerId) {
            this.players[slotId] = null;
            this.stateBeforeHold  = this.state;
            this.state = STATES.HOLD;
            this.hasAllPlayersJoined = false;
        }
    }


    this.showTrump = function() {
        if(this.state == STATES.PLAY) {
            this.trumpShown = true;
            this.messages[this.messageId++] = this.players[this.currentSlot] + ' requested trump to be shown.';
        }
    }

    this.finishRound  = function() {
        var slotWhoWon = this.whichSlotWonTheRound();
        console.log('finishing round');
        var points = 0;
        for(card in this.tableCards) {
            points += this.tableCards[card].point;
        }

        if(slotWhoWon % 2 == 0) {
            this.team2Points += points;
        } else {
            this.team1Points +=  points;
        }

        var teamWon = this.whichTeamWonTheGame();
        if(teamWon == -1) {
            this.lastRoundCards[0] = this.tableCards[this.currentPlayRoundStartSlot];
            this.lastRoundCards[1] = this.tableCards[(this.currentPlayRoundStartSlot+1)%4];
            this.lastRoundCards[2] = this.tableCards[(this.currentPlayRoundStartSlot+2)%4];
            this.lastRoundCards[3] = this.tableCards[(this.currentPlayRoundStartSlot+3)%4];

            this.tableCards = [];
            this.currentPlayRoundStartSlot = slotWhoWon;
            this.currentSlot = slotWhoWon;
            this.currentRoundPlays = 0;
            this.playRound += 1;
        } else {
            this.finishGame(teamWon);
        }
    }

    this.finishGame = function(team) {
      var penalty = 1;
      var isSenior = false;
      var isHonors = false;

      if(this.teamWithTrump != team) {
          penalty += 1;
      }
      if(this.currentCallValue >= 20 ) {
          penalty += 1;
          isHonors = true;
      }

      if(this.currentCallValue >= 24) {
          penalty += 1;
          isSenior = true;
      }

      if(team == 0) {

          this.team2GamePoints += penalty;
          this.team1GamePoints -= penalty;
          this.updateUserPenalty(penalty, this.players[0].id, true, isSenior, isHonors);
          this.updateUserPenalty(penalty, this.players[2].id, true, isSenior, isHonors);
          this.updateUserPenalty(penalty, this.players[1].id, false, isSenior, isHonors);
          this.updateUserPenalty(penalty, this.players[3].id, false, isSenior, isHonors);
      } else {
          this.team1GamePoints += penalty;
          this.team2GamePoints -= penalty;
          this.updateUserPenalty(penalty, this.players[1].id, true, isSenior, isHonors);
          this.updateUserPenalty(penalty, this.players[3].id, true, isSenior, isHonors);
          this.updateUserPenalty(penalty, this.players[0].id, false, isSenior, isHonors);
          this.updateUserPenalty(penalty, this.players[2].id, false, isSenior, isHonors);
      }

      this.state = STATES.END;
      this.advanceToNextState();

    }

    this.addChatMessage = function(playerName, chatMessage) {
        var message =  playerName + ": " + chatMessage;
        this.chatId = this.chatId +  1;
        console.log('chatMessage is :' +  chatMessage + 'playerName=' +playerName + ' chatid= ' + this.chatId);
        this.chats[this.chatId] = message + "\n";
        console.log('chats==== ' + this.chats);
    }

    this.updateUserPenalty = function(penalty, userId, won, isSenior, isHonors) {
        var profilePointMultiplier = 3;
        var pointMultiplier = 1;
        User.findOne({'_id': new ObjectId(userId)}, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return console.log('could not find the user' + err);

            // check to see if theres already a user with that email
            if (user) {
                console.log('Updating user points:' + userId);
                if(isSenior && won) {
                    user.data.seniorsWon += 1;
                    pointMultiplier = 3;
                }

                if(isHonors && won) {
                    user.data.honorsWon += 1;
                    pointMultiplier = 2;
                }

                if(!won) {
                    penalty = 0 - penalty;
                }
                user.data.points += penalty;
                user.data.gamesPlayed += 1;

                if(penalty > 0) {
                    user.data.profilePoints += penalty * pointMultiplier * profilePointMultiplier;
                    user.data.pointsFor += penalty * pointMultiplier;
                } else {
                    user.data.pointsAgainst -= penalty * pointMultiplier;
                    user.data.profilePoints += 1;
                }

                if(user.data.profilePoints >= 25) {
                    user.data.level = "Novice";
                }

                if(user.data.profilePoints >= 50) {
                    user.data.level = "Rookie";
                }

                if(user.data.profilePoints >= 100) {
                    user.data.level = "Talented";
                }

                if(user.data.profilePoints >= 200) {
                    user.data.level = "Senior";
                }

                if(user.data.profilePoints >= 400) {
                    user.data.level = "Expert";
                }

                if(user.data.profilePoints >= 1000) {
                    user.data.level = "Master";
                }

                if(user.data.profilePoints >= 2000) {
                    user.data.level = "Ninja";
                }

            }

            // save the user
            user.save(function(err) {
                console.log("Error-:  in saving user statistics");
            });

        });
    }

    this.whichSlotWonTheRound = function() {
        var biggestSlot = this.currentPlayRoundStartSlot;
        var startSuit = this.currentPlayRoundSuit;
        var firstCard = this.tableCards[this.currentPlayRoundStartSlot];
        for(var i =0 ; i<this.tableCards.length; i++) {
             var card = this.tableCards[i];
             if(card.suit == firstCard.suit) {
                  if(card.order > this.tableCards[biggestSlot].order) {
                      biggestSlot = i;
                  }
             }
        }

        var biggestTrumpSlot = -1;
        if(this.trumpShown) {
            for(var i =0 ; i< this.tableCards.length; i++) {
                var card = this.tableCards[i];
                if(card.suit == this.trumpSuit) {
                    if(biggestTrumpSlot < 0) {
                        biggestTrumpSlot = i;
                    } else {
                        if(card.order > this.tableCards[biggestTrumpSlot].order) {
                            biggestTrumpSlot = i;
                        }
                    }

                }
            }
        }

        if(biggestTrumpSlot >= 0) {
            biggestSlot = biggestTrumpSlot;
        }

        return biggestSlot;
    };

    this.whichTeamWonTheGame = function() {
       if(this.teamWithTrump == 0) {
           if(this.team2Points >= this.currentCallValue ) return 0;
           if(this.team1Points > (28 - this.currentCallValue)) return 1;
       } else {
           if(this.team1Points >= this.currentCallValue ) return 1;
           if(this.team2Points > (28 - this.currentCallValue)) return 0;
       }
       return -1;
    }

    this.isCardValid = function(playerId, rank, suit) {
        var currentPlayerId = this.players[this.currentSlot].id;
        if(currentPlayerId == playerId && this.players[this.currentSlot].hasCard(rank, suit)) {
            if(this.isSuitValid(suit, this.players[this.currentSlot].cards)) {
                return true;
            }

        }
        return false;
    }

    this.isSuitValid = function(suit, cards) {

        if(this.playRound == 1 && this.currentRoundPlays == 0 && this.trumpSuit == suit) return false;

        if(this.currentRoundPlays == 0) {
           if(this.trumpShown) return true;
           if(suit != this.trumpSuit) return true;
           if(this.currentSlot != this.currentTrumpSlot) return true;
           if(this.everyCardIHaveIsTrump(cards)) return true;
           return false;
        }

        if(suit == this.currentPlayRoundSuit) return true;
        if(this.ifIDoNotHaveTheCurrentSuit(cards)) return true;

        return false;
    }

    this.everyCardIHaveIsTrump = function(cards) {
        for(var card in cards) {
            if(cards[card].suit != this.trumpSuit) return false;
        }
        return true;
    }

    this.ifIDoNotHaveTheCurrentSuit = function(cards) {
        for(var card in cards) {
            if(cards[card].suit == this.currentPlayRoundSuit) {
                return false;
            }
        }
        return true;
    }

    this.call = function(playerId, callValue) {
        console.log('playerID='+playerId);
        var currentPlayerId = this.players[this.currentSlot].id;
        if(currentPlayerId == playerId && this.isCallState()) {
            //set min call value
            var minCallValue = this.nextAllowedCallValue ;
            console.log('min call value is: ' + minCallValue);

            if(this.state == STATES.CALL1) {
                if(this.currentRoundCalls > 0) {
                    if((this.currentTrumpSlot == 0 && this.currentSlot === 2)
                        || (this.currentTrumpSlot === 2 && this.currentSlot === 0)
                        || (this.currentTrumpSlot === 1 && this.currentSlot === 3)
                        || (this.currentTrumpSlot === 3 && this.currentSlot === 1)) {
                        if(minCallValue < 20) {
                            minCallValue = 20;
                        }
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
                this.currentTrumpPlayerName = this.players[this.currentTrumpSlot].displayName;
                this.nextSlotAfterCall();

                this.teamWithTrump =  this.currentTrumpSlot % 2;
                console.log('this.teamWithTrump=' +this.teamWithTrump);

            } else if(callValue < this.nextAllowedCallValue && (this.state != STATES.CALL1 || this.currentRoundCalls > 0)) {
                this.messages[this.messageId++] = this.players[this.currentSlot] + ' passed.';
                this.currentRoundPasses++;
                this.nextSlotAfterPass();

            }

            console.log('currentRoundCalls=' + this.currentRoundCalls);
            if(this.currentRoundCalls >= 4 && this.isCallState()) {
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
        this.messages[this.messageId++] = 'Waiting for player ' + this.currentTrumpPlayerName + ' to select a trump.';
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
                this.messages[this.messageId++] = 'Waiting for player ' + this.currentTrumpPlayerName + ' to select a trump.';
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
                if(this.currentCallValue  >= 24) {
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
                this.currentRoundStartSlot  = (this.currentRoundStartSlot + 1) % NO_PLAYERS;
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
            this.messages[this.messageId++] = 'Player ' + this.currentTrumpPlayerName + ' selected a trump.';
        }
    }

}

Room.prototype.toString = function toString() {
    return this.game.toString;
}

module.exports = Room;