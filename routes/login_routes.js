function getDeviceMap(request) {
    var ua = request.headers['user-agent'],
        deviceMap = {};

    if (/mobile/i.test(ua))
        deviceMap.Mobile = true;

    if (/like Mac OS X/.test(ua)) {
        deviceMap.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
        deviceMap.iPhone = /iPhone/.test(ua);
        deviceMap.iPad = /iPad/.test(ua);
    }

    if (/Android/.test(ua))
        deviceMap.Android = /Android ([0-9\.]+)[\);]/.exec(ua)[1];

    if (/webOS\//.test(ua))
        deviceMap.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];

    if (/(Intel|PPC) Mac OS X/.test(ua))
        deviceMap.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;

    if (/Windows NT/.test(ua))
        deviceMap.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];

    return deviceMap;
}


module.exports = function (app, passport) {

    // show the login form
    app.get('/landing', function(req, res) {
        var deviceMap = getDeviceMap(req);
        if(deviceMap.Mobile) {
            res.redirect('/mobile/www');
        } else {
            res.redirect('/');
        }
    });

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


    app.get('/user', function(req, res) {
        if(req.user) {
            res.send( { displayName: req.user.data.displayName, userId: req.user.id} );
        } else {
            res.send({displayName: null});
        }
    });

    app.get('/userobject', function(req, res) {
        if(req.user) {
            res.send( { displayName: req.user.id} );
        } else {
            res.send({displayName: null});
        }
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', {scope : 'email'}));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/landing',
            failureRedirect : '/login'
        })
    );

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

};