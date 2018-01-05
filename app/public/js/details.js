$(document).ready(function() {
    $('#table').on('click','.details',function () {
        var currency = ($(this).text()).toLowerCase();
        if(currency != undefined && currency != "name"){
            $('#currency-detail-modal-title').html('Loading...');
            $('#container-detail, #container-detail-error').hide();
            $('#container-loading').show();
            $('#currency-detail').modal();
            $.ajax({
                url: '/currency/details/?value='+currency,
                type: 'GET',
                success: function(data) {
                    //called when successful
                    var json = JSON.parse(data);
                    if(json.hasOwnProperty('error')) {
                        $('#container-loading').hide();
                        $('#currency-detail-modal-title').html('ERROR');
                        $('#container-detail-error').show();
                    }
                    else {
                        $.each( json[0], function( key, value ) {
                            $('#currency-detail-'+key).text(value);
                        });
                        $('#container-loading').hide();
                        $('#currency-detail-modal-title').html(currency.toUpperCase());
                        $('#container-detail, #currency-detail-modal-title').show();
                    }
                },
                error: function(e) {
                    $('#container-loading').hide();
                    $('#currency-detail-modal-title').html('ERROR');
                    $('#container-detail-error').show();
                    console.log(e);
                }
            });
        }
    });
});
