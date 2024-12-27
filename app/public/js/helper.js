function getURLParams(key){
    let params={};
    location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,key,value){params[key]=value});
    return key?params[key]:params;
}

function convertRelativePathToAbsolute(div, baseURL) {
    $(div).find('a').each(function() {
        $(this).css({
            'color' : "blue",
            'text-decoration' : "underline"
        });
        if(!(/^(?:[a-z]+:)?\/\//i.test($(this).attr('href')))) {
            const url = baseURL + $(this).attr('href');
            $(this).attr('href', url);
        }
    });
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

    $('#hide-show-columns :checkbox').change(function () {
        const $table = $('#table');
        const id = $(this).attr('id');
        if (this.checked) {
            $table.bootstrapTable('showColumn', id);
        } else {
            $table.bootstrapTable('hideColumn', id);
        }
    })
});
