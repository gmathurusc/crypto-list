$(document).ready(function() {
    $('#table').on('click','.details',function () {
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

                    $('#currency-detail').modal();
                    var modal = new Custombox.modal({
                        content: {
                            effect: 'fadein',
                            target: '#currency-detail',
                        }
                    });
                    $('#currency-detail-modal-title').html(currency.toUpperCase());
                    modal.open();
                },
                error: function(e) {
                }
            });
        }
    });

    $(function () {
        $('#currency-detail-clear-btn-top-right, #currency-detail-clear-btn-bottom-right').click(function () {
            Custombox.modal.close();
        })
    })
});
