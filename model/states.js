var STATES = {
    WAIT:  {id: 0, message: 'Waiting for players to join'},
    READY: {id: 1, message: 'Press start game to start the game'},
    CALL1: {id: 2, message: 'Waiting for players to call(Round1)'},
    CALL2: {id: 3, message: 'Waiting for players to call(Round2)'},
    TRUMP1: {id: 4, message: 'Waiting for players to select trump.'},
    CALL3: {id: 5, message: 'Waiting for players to call(Round3)'},
    TRUMP2: {id: 6, message: 'Waiting for players to select trump.'},
    PLAY:  {id: 7, message: 'Game in progress'},
    END:   {id: 8, message: 'Game has ended'}
};

module.exports = STATES;