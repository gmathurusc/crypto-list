$( window ).resize(function() {
    //windowSizeActions();
});

function windowSizeActions() {
    if ($(window).width() < 800) {
        $('.modal-content').css("width","100%");
        $('#table').addClass('small-font');
        $('th.optional').each(function () {
            var field = $(this).data('field');
            $table.bootstrapTable('hideColumn', field);
        });
        $('#hide-show-columns').addClass('hide-mobile');

    }

    else {
        $('.modal-content').css("width","120%");
        $('#table').removeClass('small-font');

        $table.bootstrapTable('showAllColumns');
        $('#hide-show-columns').removeClass('hide-mobile');
    }
}