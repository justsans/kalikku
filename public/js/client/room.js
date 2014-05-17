var roomTmpl;
var io = io.connect();

function init() {
    var roomId = getParameterByName('roomId');
    io.emit( "/room/show", {'roomId': roomId});
}

$.when(
    $.get( "tmpl/room.dot", function( tmpl ) {
        roomTmpl = doT.template( tmpl );
    }, "text" )
).then( init );


// Listen for the announce event.
io.on('updateTable', function (data) {
    $( "div.roomDiv" ).html( roomTmpl( data ) );
    var roomId = getParameterByName('roomId');
    $("#startButton").click(function() {
        io.emit('startGame', {'roomId': roomId, 'action': 'startGame'});
    });
});

io.on('updateMessage', function (data) {
    $('.messagesDiv').append('<p>' + data.message + '</p>')
});



function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$( document ).ready(function() {
    var roomId = getParameterByName('roomId');
    $("#startButton").click(function() {
        io.emit('startGame', {'roomId': roomId, 'action': 'startGame'});
    })

});
