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

    $(".callButton").click(function() {
        var callValue = $(this).attr("value");
        io.emit('call', {'roomId': roomId, 'callValue': callValue});
    })  ;

    $(".card").click(function() {
        var suit = $(this).attr("suit");
        var rank = $(this).attr("rank");
        if(data.room.state.id == 7) {
            io.emit('play', {'roomId': roomId, 'suit': suit, 'rank' :  rank});
        } else if(data.room.state.id == 4 || data.room.state.id == 6) {
            io.emit('selectTrump', {'roomId': roomId, 'suit': suit, 'rank' :  rank});
        }

    })
});

io.on('updateMessage', function (data) {
    var messagesTextArea    = $('#messagesTextArea');
    messagesTextArea.val(messagesTextArea.val() + data + "\n" );
    alert(messagesTextArea.scrollHeight);
    messagesTextArea.scrollTop(messagesTextArea[0].scrollHeight);
});



function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
