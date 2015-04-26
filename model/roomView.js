
var RoomView = function RoomView(room, slotId) {
   var numberOfActivePlayers = 0;

   this.roomId = room.roomId;
   this.state = room.state;
   this.players = [null,null,null,null];
   this.cards = [];
   this.tableCards = room.tableCards;
   this.nextAllowedCallValue = room.nextAllowedCallValue;


   for(var i=0; i < room.players.length; i++) {
       var player =  room.players[i];
       if(player) {
           this.players[i] = {'displayName': player.displayName};
       }
   }

   this.hasAllPlayersJoined = room.hasAllPlayersJoined;

   if(room.players[slotId]) {
       this.playerId = room.players[slotId].id;
       this.cards = room.players[slotId].cards;
   }

}

RoomView.prototype.toString = function toString() {
    return this.RoomView.toString;
}

module.exports = RoomView;