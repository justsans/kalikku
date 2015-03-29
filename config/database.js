
function createDBSettings(mongoLabURI) {
    var dbSettings = {};
    console.log('mongoLabUri isssssss: ' + mongoLabURI);
    var regexp = /^mongodb:\/\/(\w+):(\w+)@(\w+):(\w+)\/(\w+)$/;
    var matches = mongoLabURI.match(regexp);

    dbSettings.host = matches[3];
    dbSettings.port = matches[4];
    dbSettings.username = matches[1];
    dbSettings.password = matches[2];
    dbSettings.db = matches[5];

    return dbSettings;
}

var dbConfig = {db: 'userSessions'}

if(process.env.MONGOLAB_URI) {
  dbConfig = createDBSettings(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL);
}

module.exports = {

    'url' : process.env.MONGOLAB_URI ||
        process.env.MONGOHQ_URL || 'mongodb://localhost:27017/'   ,
    'cookie_secret': 'dennisinuithukaliyakampakshenjangalkithuverumkaliyalla',
    'dbConfig':  dbConfig

};