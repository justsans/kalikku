var Card = require('../model/card');

function createDBSettings(mongoLabURI) {
    var dbSettings = {};
    var regexp = /^mongodb:\/\/(\w+):(\w+)@(\w+):(\w+)\/(\w+)$/;
    var matches = mongoLabURI.match(regexp);

    dbSettings.db = matches[5];
    dbSettings.host = matches[3];
    dbSettings.port = matches[4];
    dbSettings.username = matches[1];
    dbSettings.password = matches[2];

    return dbSettings;
}

describe("Card", function() {
  beforeEach(function() {
    
  });


  it("should be able to parse mongoLab uri", function() {
        var dbSettings = createDBSettings('mongodb://dbuser:dbpass@host:port/dbname');
        expect(dbSettings.db).toEqual('dbname');
        expect(dbSettings.username).toEqual('dbuser');
        expect(dbSettings.password).toEqual('dbpass');
        expect(dbSettings.port).toEqual('port');
        expect(dbSettings.host).toEqual('host');
  });


  it("should be able to get Rank and Suit in a card", function() {
    var card = new Card('8', 'S');
    expect(card.rank).toEqual('8');
	expect(card.suit).toEqual('S');
  });

  it("should be able to create multiple cards", function() {
	    var card = new Card('8', 'S');
	    var card1 = new Card('9', 'H');
		expect(card.rank).toEqual('8');
		expect(card.suit).toEqual('S');
	    expect(card1.rank).toEqual('9');
		expect(card1.suit).toEqual('H');
  });

});
