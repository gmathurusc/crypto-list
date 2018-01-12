$(document).ready(function() {
    $('#table').on('click','.details',function () {
        var currency = ($(this).text());
        if(currency != undefined && currency.toLowerCase() != "name"){
            window.location.href = "/details/?value="+currency;
        }
    });
});
