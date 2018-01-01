var $table = $('#table');

function rangeFilter(jsonData) {

    var grepFunc = function (item) {
        var priceMinValue = parseFloat($('#price_min').val());
        var priceMaxValue = parseFloat($('#price_max').val());

        var supplyMinValue = parseFloat($('#min_max_supply').val());
        var supplyMaxValue = parseFloat($('#max_max_supply').val());

        return isInRange(priceMinValue, priceMaxValue, item.price_usd) &&
            isInRange(supplyMinValue, supplyMaxValue, item.max_supply)
    };
    $table.bootstrapTable('load', $.grep(jsonData, grepFunc));
}

function isInRange(minValue, maxValue, value) {
    return greaterThanMinValue(minValue, value) && lesserThanMaxValue(maxValue, value)
}

function greaterThanMinValue(minValue, value) {
    return (isNaN(minValue) || minValue == 0) || parseFloat(value) >= minValue;
}

function lesserThanMaxValue(maxValue, value) {
    return (isNaN(maxValue) || maxValue == 0) || parseFloat(value) <= maxValue;
}