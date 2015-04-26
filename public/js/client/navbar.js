var navbarTmpl;

function init() {
    $.get( "user", function( info ) {
        $( "div.navbarContainer" ).html( navbarTmpl(info) );
    });
}

$.when(
    $.get( "tmpl/navbar.dot", function( tmpl ) {
        navbarTmpl = doT.template( tmpl );
    }, "text" )
).then( init );