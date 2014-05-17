module.exports = function (app, rooms) {
    require("./room_routes")(app, rooms);
    // add new lines for each other module, or use an array with a forEach
};