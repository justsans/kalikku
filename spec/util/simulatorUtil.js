
var Simulator = function Simulator() {
   this.addPlayersAndStartGame = function(room) {
       room.addPlayer('0',0, 'Player 0');
       room.addPlayer('1',1, 'Player 1');
       room.addPlayer('2',2, 'Player 2');
       room.addPlayer('3',3, 'Player 3');

       room.start();
   };

   this.callCALL1 = function(room) {
       room.call('0',14);
       room.call('1',0);
       room.call('3',0);
       room.call('2',0);
   };


   this.everyonePass = function(room) {
       room.call('0',0);
       room.call('1',0);
       room.call('2',0);
       room.call('3',0);
   };

   this.doAllStepsUntilPlay = function(room) {
       this.addPlayersAndStartGame(room);

       //call round 1
       this.callCALL1(room);

       //call round 2
       this.everyonePass(room);

       //select trump
       room.selectTrump('0', '9', 'S');

       //call round 3
       this.everyonePass(room);
   }
};

module.exports = Simulator;
