$(document).ready(function() {
    $('#table').on('click','.details',function () {
        var currency = ($(this).text());
        if(currency !== undefined && currency.toLowerCase() !== "name"){
            window.location.href = "/details/?value="+currency;
        }
    });
});

function getHistory(symbol, day) {
    if($('#charts').css('display') == 'none')
        $('#container-loading').show();
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
                $('#charts').show();
                $('#container-loading').hide();
            }
            else {
                $('#container-loading').hide();
            }
        },
        error: function(e) {
            console.log(e);
        }
    });
}

function getCoinDetails(symbol) {
    $.ajax({
        url: '/currency/details/?value='+symbol+'&day='+day,
        type: 'GET',
        success: function(data) {
            var json = JSON.parse(data);
            if(json !== null) {
                setDetailsInfo(json);
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

function setDetailsInfo(json) {
    var desc = json.Data.General.Description;
    var features = json.Data.General.Features;
    var technology = json.Data.General.Technology;
    var website = json.Data.General.Website;
    var twitter = json.Data.General.Twitter;
    var baseURL = json.Data.SEO.BaseUrl !== null ? json.Data.SEO.BaseUrl : "https://www.cryptocompare.com";
    var misc = [];

    if(desc === undefined && features === undefined && technology === undefined) {
        $('#description-options').hide();
        $('#description-tabs').hide();
    }
    else {
        if(desc !== null && desc !== "" && desc !== undefined) {
            $('#description-content').html(desc);
            convertRelativePathToAbsolute('#description-content', baseURL);
        }
        else {
            $('#description-tab').hide();
            $('#description').hide();
        }
        if(features !== null && features !== "" && features !== undefined) {
            $('#features-content').html(features);
            convertRelativePathToAbsolute('#features-content', baseURL);
        }
        else {
            $('#features-tab').hide();
            $('#features').hide();
        }
        if(technology !== null && technology !== "" && technology !== undefined) {
            $('#technology-content').html(technology);
            convertRelativePathToAbsolute('#technology-content', baseURL);
        }
        else {
            $('#technology-tab').hide();
            $('#technology').hide();
        }
    }

    if(website !== null && website !== "" && website !== "-" && website !== undefined) {
        $("#coin_name_buttons_name").html(website);
        misc['website'] = website;
    }

    if(twitter !== null && twitter !== "" && twitter !== undefined) {
            if(!(/^(?:[a-z]+:)?\/\//i.test(twitter))){
                $("#twitter-content").attr('href', "https://twitter.com/" + twitter);
            }
            else {
                $("#twitter-content").attr('href', twitter);
            }
            if(!(/[@]/gi.test(twitter)))
                twitter = '@'+twitter;
            $("#twitter-content").text(twitter);
            $("#twitter-div").show()
        }

    // if(json.Data.General.Algorithm !== null)
    //     $("#algorithm-content").html(json.Data.General.Algorithm);
    // else
    //     $("#algorithm-content").html("-");
    //
    // if(json.Data.General.Twitter !== null){
    //     $("#twitter-content").attr('href', "https://twitter.com/" + json.Data.General.Twitter);
    //     $("#twitter-content").text(json.Data.General.Twitter);
    // }
    // else
    //     $("#twitter-content").html("-");
    //
    // if(json.Data.General.StartDate !== null)
    //     $("#startdate-content").html(json.Data.General.StartDate);
    // else
    //     $("#startdate-content").html("-");
    //
    // if(json.Data.General.Sponsor.Link !== null) {
    //     $("#link-content").attr('href', json.Data.General.Sponsor.Link);
    //     $("#link-content").text(json.Data.General.Sponsor.Link);
    // }
    // else
    //     $("#link-content").html("-");
    //
    // if(json.Data.General.TotalCoinsMined !== null)
    //     $("#total-coins-mined-content").html(json.Data.General.TotalCoinsMined);
    // else
    //     $("#total-coins-mined-content").html("-");
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
                borderColor: '#fff',
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
                    fontColor: "#1F2739",
                    fontSize: 18
                }
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    ticks: {
                        fontColor: "#1F2739",
                        fontSize: 18
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontColor: "#1F2739",
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
