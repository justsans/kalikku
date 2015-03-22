
module.exports = function (app, rooms, passport) {
    require("./room_routes")(app, rooms);
    require("./login_routes")(app, passport);
    // add new lines for each other module, or use an array with a forEach
};