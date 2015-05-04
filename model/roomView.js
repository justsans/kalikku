
var RoomView = function RoomView(room) {
    var numberOfActivePlayers = 0;

    this.roomId = room.roomId;
    this.state = room.state;
    this.players = [null,null,null,null];
    this.cards = [];
    this.tableCards = room.tableCards;
    this.currentSlot = room.currentSlot;
    this.nextAllowedCallValue = room.nextAllowedCallValue;
    this.team1Points = room.team1Points;
    this.team2Points = room.team2Points;
    this.team2GamePoints = room.team2GamePoints;
    this.team1GamePoints = room.team1GamePoints;
    this.trump = 'Not Shown';
    this.trumpShown = room.trumpShown;
    this.currentCallValue = room.currentCallValue;
    this.currentTrumpPlayerName = room.currentTrumpPlayerName;
    this.lastRoundCards = room.lastRoundCards;
    if(room.trumpShown && room.trump) {
        this.trumpDisplayText = room.trump.displayText;
        this.trump = room.trump.toString();
    }


    for(var i=0; i < room.players.length; i++) {
       var player =  room.players[i];
       if(player) {
           this.players[i] = {'displayName': player.displayName};
       }
    }

    this.hasAllPlayersJoined = room.hasAllPlayersJoined;

}

RoomView.prototype.toString = function toString() {
    return this.RoomView.toString;
}

module.exports = RoomView;