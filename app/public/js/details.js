$(document).ready(function() {
    $('#table').on('click','.details',function () {
        var currency = ($(this).text());
        if(currency !== undefined && currency.toLowerCase() !== "name"){
            window.location.href = "/details/?value="+currency;
        }
    });
});

function getHistory(symbol, day) {
    $.ajax({
        url: '/currency/history/?value='+symbol+'&day='+day,
        type: 'GET',
        success: function(data) {
            var json = JSON.parse(data);
            if(json !== null) {
                var marketCap = 'market_cap' in json ? json['market_cap'] : '';
                var price = 'price' in json ? json['price'] : '';
                var volume = 'volume' in json ? json['volume'] : '';
                if(price !== '') canvasCharts('price', price);
                if(volume !== '') canvasCharts('market-cap', marketCap);
                if(volume !== '') canvasCharts('volume', volume);
            }
        },
        error: function(e) {
            console.log(e);
        }
    });
}

function googleChart(type, json) {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = new google.visualization.DataTable();

        var legend = type === 'price' ? toTitleCase(type.replace('-', ' ')) : toTitleCase(type.replace('-', ' ') + ' ( in Billions )');
        data.addColumn('date', 'Time');
        data.addColumn('number', legend);

        for (var i = 0; i < json.length; i++) {
            var xAxis = new Date(json[i][0]);
            var yAxis = type === 'price' ? json[i][1] : json[i][1] / 1000000000;
            data.addRow([xAxis, yAxis]);
        }

        var options = {
            title: toTitleCase(type.replace('-', ' ') + ' ( $ )'),
            curveType : 'function',
            legend    : { position: 'bottom' },
            colors    : ['#337ab7'],
            backgroundColor: "#b8d1f3",
            vAxis:{
                textStyle: {
                    color: '#555'
                },
                baselineColor: '#fff',
                gridlineColor: '#fff'
            },
            hAxis:{
                textStyle: {
                    color: '#555'
                },
                baselineColor: '#fff',
                gridlineColor: '#fff'
            }
        };

        var chart = new google.visualization.LineChart(document.getElementById(type+'-chart'));
        chart.draw(data, options);
    }
}

function canvasCharts(option, json) {
    var xAxisData = [];
    var yAxisData = [];
    for (var i = 0; i < json.length; i++) {
        var xAxis = new Date(json[i][0]);
        var yAxis = option === 'price' ? json[i][1] : json[i][1] / 1000000000;
        xAxisData.push(xAxis);
        yAxisData.push(yAxis);
    }
    var label = option === 'price' ? toTitleCase(option.replace('-', ' ')) + ' ( $ ) ' : toTitleCase(option.replace('-', ' ') + ' ( $ in Billions )');

    var chart = {
        labels: xAxisData,
        datasets : [
            {
                label: label,
                backgroundColor: '#337ab7',
                borderColor: '#005172',
                data: yAxisData,
                fill: false
            }
        ]
    };

    var itemNode = document.getElementById(option+'-chart');
    itemNode.parentNode.removeChild(itemNode);
    document.getElementById(option+'-chart-div').innerHTML = '<canvas id="'+option+'-chart"></canvas>';
    var ctx = document.getElementById(option+'-chart').getContext("2d");

    new Chart(ctx, {
        type: 'line',
        data: chart,
        fill: false,
        options: {
            elements: { point: { radius: 0 } },
            legend: {
                labels: {
                    fontColor: "black",
                    fontSize: 18
                }
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    ticks: {
                        fontColor: "black",
                        fontSize: 18
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontColor: "black",
                        fontSize: 18
                    }
                }]
            },
            tooltips: {
                titleFontSize: 14,
                bodyFontSize: 18
            }
        }
    });
}
