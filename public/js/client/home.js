var homeTmpl;

function init() {
    $.get( "rooms", function( info ) {
        $( "div.rooms" ).html( homeTmpl( info ) );
    });
}

$.when(
    $.get( "tmpl/home.dot", function( tmpl ) {
        homeTmpl = doT.template( tmpl );
    }, "text" )
).then( init );