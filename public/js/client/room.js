var roomTmpl;
var cardDeckTmpl;
var io = io.connect();
var timeout;
var winnerTimeout;

function init() {
    var roomId = getParameterByName('roomId');
    io.emit( "/room/show", {'roomId': roomId});
    $('.chatButton').click(function() {
        io.emit('chat', {roomId: roomId, message: $('.chatTextBox').val()});
        $('.chatTextBox').val('');
    });
    $(".chatTextBox").keyup(function(event){
        if(event.keyCode == 13){
            $(".chatButton").click();
        }
    });

}

$.when(
    $.get( "tmpl/cardDeck.dot", function( tmpl ) {
        cardDeckTmpl = doT.template( tmpl );
    }, "text" )
).then(  );

$.when(
    $.get( "tmpl/room.dot", function( tmpl ) {
        roomTmpl = doT.template( tmpl );

    }, "text" )
).then( init );


// Listen for the announce event.
io.on('updateTable', function (data) {
    $("div.roomDiv").html(roomTmpl(data));
    var roomId = getParameterByName('roomId');
    $('.team1GamePoints').html(data.view.team1GamePoints);
    $('.team1Points').html(data.view.team1Points);
    $('.team2GamePoints').html(data.view.team2GamePoints);
    $('.team2Points').html(data.view.team2Points);
    $('.lastCall').html('');

    if(data.view.currentCallValue && data.view.currentTrumpPlayerName) {
        $('.lastCall').html(data.view.currentCallValue + " by " + data.view.currentTrumpPlayerName);
    }
    if(data.view.state.id < 3) {
        $(".trumpDiv").html('');
    }

    if(data.view.state.id == 7) {
        if (data.view.trumpShown) {
            $(".trumpDiv." + data.view.currentTrumpSlot).html("<img class='card' src='/images/classic-cards/" + data.view.trump + ".png'/>");
        } else {
            $(".trumpDiv."+ data.view.currentTrumpSlot).html("<img class='card showTrump' src='/images/classic-cards/b2fv.png'/>");
        }
    }

    if(data.view.state.id == 7) {
        $('.lastRoundCards').html('');
        if(data.view.lastRoundCards.length > 0) {
            for(var i =0 ; i<4; i++) {
                $('.lastRoundCards').append("<img class='card' src='/images/classic-cards/" + data.view.lastRoundCards[i].rank + data.view.lastRoundCards[i].suit + ".png'/>");
            }
        }
        $(".actionPanel").css('visibility','hidden');
    }

    $("#startButton").click(function () {
        io.emit('startGame', {'roomId': roomId, 'action': 'startGame'});
    });

    $(".joinButton").click(function () {
        var userId = $("#userId").attr("value");
        io.emit('join', {'roomId': roomId, 'action': 'joinGame', 'slotId': $(this).attr("slot"), userId: userId});
    });

    $(".ejectButton").click(function () {
        var userId = $("#userId").attr("value");
        io.emit('eject', {'roomId': roomId, 'action': 'eject', 'slotId': $(this).attr("slot"), userId: userId});
    });

    function eject(){
        $(".playerslot." + data.view.currentSlot +  " .ejectContainer").css('visibility','visible');
    }

    clearTimeout(timeout);
    timeout = setTimeout(eject, 60000);

    $('.standupButton').click(function() {
        var userId = $("#userId").attr("value");
        io.emit('standup', {'roomId': roomId, 'action': 'standup', userId: userId});
    });


    $('.restartGameButton').click(function() {
        var userId = $("#userId").attr("value");
        io.emit('restartGame', {'roomId': roomId, 'action': 'startGame', userId: userId});
    });

    $(".winnerIcon").css('visibility', 'hidden');
    clearTimeout(winnerTimeout);
    function showWinner(teamWon){
        $(".winnerIcon." + teamWon).css('visibility','visible');
        function hideWinner() {
            $(".winnerIcon." + teamWon).css('visibility', 'hidden');
        }
        winnerTimeout = setTimeout(hideWinner, 20000);
    }

    if(data.view.state.id == 1 && data.view.teamWon >= 0) {
    //    showWinner(1);
        showWinner(data.view.teamWon);
    }



});

io.on('updateCallPopup', function(data) {
    $('.callBody').html('');
    $(".actionPanel").css('visibility','visible');
    console.log("got message in updateCallPopup "+ data.nextAllowedCallValue);
    var roomId = getParameterByName('roomId');
    for (var val = 14; val <= 28; val++) {
        if (data.nextAllowedCallValue <= val) {
            $('.callBody').append('<button type="submit" class="callButton" value="' + val + '">' + val + '</button>');
        }
    }
    $('.callBody').append('<button type="submit" class="callButton" value="0">PASS</button>');

    //$("#myModal").modal('show');
    $(".callButton").click(function () {
        var callValue = $(this).attr("value");
        $('.callBody').html('');
        //$("#myModal").modal('hide');
        io.emit('call', {'roomId': roomId, 'callValue': callValue});
    });
});

io.on('updateCards', function(data) {
    console.log('Got CARDS:' + data.cards + ' and ' + data.enableShowTrumpButton);
    $(".mydeckBody").html( cardDeckTmpl( data ) );
    var roomId = getParameterByName('roomId');
    if(data.enableShowTrumpButton == true) {
        $(".showTrump").click(function() {
                io.emit('showTrump', {'roomId': roomId});
        });
    }

    $(".card").click(function() {
        var suit = $(this).attr("suit");
        var rank = $(this).attr("rank");
        if(data.state.id == 7) {
            io.emit('play', {'roomId': roomId, 'suit': suit, 'rank' :  rank});
        } else if(data.state.id == 4 || data.state.id == 6) {
            io.emit('selectTrump', {'roomId': roomId, 'suit': suit, 'rank' :  rank});
        }

    });

});

io.on('updateChat', function (data) {
    var chatTextArea    = $('.chatTextArea');
    chatTextArea.append(data + "<br\>" );
    chatTextArea.scrollTop(chatTextArea[0].scrollHeight);
});

io.on('updateMessage', function (data) {
    var messagesTextArea    = $('.messagesTextArea');
    messagesTextArea.append(data.messageText + "\n" );
    messagesTextArea.scrollTop(messagesTextArea[0].scrollHeight);
});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
