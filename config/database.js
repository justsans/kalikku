
function createDBSettings(mongoLabURI) {
    var dbSettings = {};
    var regexp = /^mongodb:\/\/(\w+):(\w+)@(\w+):(\w+)\/(\w+)$/;
    var matches = regexp.match(mongoLabURI);

    dbSettings.db = matches[5];
    dbSettings.host = matches[3];
    dbSettings.port = matches[4];
    dbSettings.username = matches[1];
    dbSettings.password = matches[2];

    return dbSettings;
}

var dbUrl = '';
var dbConfig = {db: 'userSessions'}

if(process.env.MONGOLAB_URI) {
  dbConfig = createDBSettings(process.env.MONGOLAB_URI);
}

module.exports = {

    'url' : process.env.MONGOLAB_URI ||
        process.env.MONGOHQ_URL || 'mongodb://localhost:27017/'   ,
    'cookie_secret': 'dennisinuithukaliyakampakshenjangalkithuverumkaliyalla',
    'dbConfig':  dbConfig

};