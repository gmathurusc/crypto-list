function priceFormatter(value) {
    var currencyFormatterObject = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
    return currencyFormatterObject.format(value);
}

function inversePriceFormatter(value) {
    var currencyFormatterObject = new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2 });
    return currencyFormatterObject.format(1/value);
}

function decimalFormatter(value) {
    var decimalFormatterObject = new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 0 });
    return decimalFormatterObject.format(value);
}

function percentageFormatter(value) {
    if (value == null) {
        return "-"
    }
    return value + ' %';
}

function numberHumanizer(value) {
    if (value == null) {
        return "-"
    }
    return '$' + Humanize.compactInteger(value, 1);
}

function cellStyle(value, row, index) {
   if(value == undefined) {
       return {};
   }
   if(parseFloat(value) < 0.0){
        return {classes : "red , text-align-right" };
    }
    if(parseFloat(value) >= 0.0 && parseFloat(value) <= 100.0){
        return {classes : "green , text-align-right" };
    }

    if(parseFloat(value) > 100.0){
        return {classes : "gold , text-align-right" };
    }
}

function addLogo(value, row) {
    var currency = row.name.replace(/\s/g,"");
    return '<p>' + value +  '</span></p><p style="float: left" class="sprite small_coin_logo sprite-'+currency.toLowerCase()+'"></p>';
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}