

module.exports = function (app, passport) {

    // show the login form
    app.get('/login', function(req, res) {
       res.render('login', {message: req.flash('loginMessage')})
    });

    // show the login form
    app.get('/signup', function(req, res) {
        res.render('signup', {message: req.flash('signupMessage')})
    });


    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the login page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    app.get('/user', function(req, res) {
        if(req.user) {
            res.send( { displayName: req.user.local.name} );
        } else {
            res.send({displayName: null});
        }
    });

};