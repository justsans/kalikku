module.exports = {

    'url' : process.env.MONGOLAB_URI ||
        process.env.MONGOHQ_URL || 'mongodb://localhost:27017/'

};