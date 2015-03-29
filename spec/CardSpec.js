var Card = require('../model/card');

function createDBSettings(mongoLabURI) {
    var dbSettings = {};
    var regexp = /^mongodb:\/\/(\w+):(\w+)@([\w.]+):(\w+)\/(\w+)$/;
    var matches = mongoLabURI.match(regexp);


    dbSettings.host = matches[3];
    dbSettings.port = matches[4];
    dbSettings.username = matches[1];
    dbSettings.password = matches[2];
    dbSettings.db = matches[5];

    return dbSettings;
}

describe("Card", function() {
  beforeEach(function() {
    
  });


  it("should be able to parse mongoLab uri", function() {
        var dbSettings = createDBSettings('mongodb://heroku_app34518149:6neriuteir36kleb2pip84dsdj@ds051831.mongolab.com:51831/heroku_app34518149');
        expect(dbSettings.db).toEqual('heroku_app34518149');
        expect(dbSettings.username).toEqual('heroku_app34518149');
        expect(dbSettings.password).toEqual('6neriuteir36kleb2pip84dsdj');
        expect(dbSettings.port).toEqual('51831');
        expect(dbSettings.host).toEqual('ds051831.mongolab.com');
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
