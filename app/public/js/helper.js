function getURLParams(key){
    var params={};
    location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,key,value){params[key]=value});
    return key?params[key]:params;
}

$(document).ready(function(){

    //Check to see if the window is top if not then display button
    $(window).scroll(function(){
        if ($(this).scrollTop() > $("body").height()) {
            $('.scrollToTop').fadeIn();
        } else {
            $('.scrollToTop').fadeOut();
        }
    });

    //Click event to scroll to top
    $('.scrollToTop').click(function(){
        $('html, body').animate({scrollTop : 0},800);
        return false;
    });
});