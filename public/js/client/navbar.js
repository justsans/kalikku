var navbarTmpl;

function init() {
    $( "div.navbarContainer" ).html( navbarTmpl() );
}

$.when(
    $.get( "tmpl/navbar.dot", function( tmpl ) {
        navbarTmpl = doT.template( tmpl );
    }, "text" )
).then( init );