// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    data             : {
        displayName : String,
        flags: {type: Number,default: 0},
        profilePoints: {type: Number,default: 0},
        points: {type: Number,default: 0},
        gamesPlayed: {type: Number,default: 0},
        pointsFor: {type: Number,default: 0},
        pointsAgainst: {type: Number,default: 0},
        honorsWon: {type: Number,default: 0},
        seniorsWon: {type: Number,default: 0},
        level: {type: String,default: 'Newbie'},
        picture: '',
        userId: ''
    },

    local            : {
        password     : String,
        name         : String,
        email        : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        picture      : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
