$(document).ready(function() {
    $('#table').on('click','.details',function () {
        $('#currency-detail-modal-title').html('Loading...');
        $('#container-detail').hide();
        $('#container-loading').show();
        $('#currency-detail').modal();
        var currency = ($(this).text()).toLowerCase();
        if(currency != undefined && currency != "name"){
            $.ajax({
                url: '/currency/details/?value='+currency,
                type: 'GET',
                success: function(data) {
                    //called when successful
                    var json = JSON.parse(data);
                    $.each( json[0], function( key, value ) {
                        $('#currency-detail-'+key).text(value);
                    });
                    $('#container-loading').hide();
                    $('#currency-detail-modal-title').html(currency.toUpperCase());
                    $('#container-detail, #currency-detail-modal-title').show();
                },
                error: function(e) {
                }
            });
        }
    });
});
