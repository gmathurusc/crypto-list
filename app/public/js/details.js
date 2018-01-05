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

    // $('#table').on('click','.symbol',function () {
    //     var symbol = ($(this).text()).toUpperCase();
    //     console.log(symbol);
    //     if(symbol != undefined && symbol != "SYMBOL"){
    //         // $('#currency-detail-modal-title').html('Loading...');
    //         // $('#container-detail, #container-detail-error').hide();
    //         // $('#container-loading').show();
    //         // $('#currency-detail').modal();
    //         $.ajax({
    //             url: '/currency/history/?value='+symbol,
    //             type: 'GET',
    //             success: function(data) {
    //                 //called when successful
    //                 var json = JSON.parse(data);
    //                 var marketCap = json['market_cap'];
    //                 var price = json['price'];
    //                 var volume = json['volume'];
    //             },
    //             error: function(e) {
    //                 console.log(e);
    //             }
    //         });
    //     }
    // });

});
