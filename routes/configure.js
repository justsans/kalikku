
module.exports = function (app, rooms, passport, io, sessionStore) {
    require("./room_routes")(app, rooms, io, sessionStore);
    require("./login_routes")(app, passport);
    // add new lines for each other module, or use an array with a forEach
};