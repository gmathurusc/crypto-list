$(document).ready(function() {
    $('#table').on('click','.details',function () {
        const currency = ($(this).text());
        if(currency !== undefined && currency.toLowerCase() !== "name"){
            window.location.href = "/details/?value="+currency;
        }
    });
});

function getHistory(symbol, day) {
    if($('#charts').css('display') === 'none')
        $('#container-loading').show();
    $.ajax({
        url: '/currency/history/?value='+symbol+'&day='+day,
        type: 'GET',
        success: function(data) {
            const json = data;
            if(json !== null) {
                canvasCharts(json);
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
            const json = data;
            if(json !== null) {
                setDetailsInfo(json);
            }
        },
        error: function(e) {
            console.log(e);
        }
    });
}

function setDetailsInfo(json) {
    const desc = json.Data.General.Description;
    const features = json.Data.General.Features;
    const technology = json.Data.General.Technology;
    const website = json.Data.General.Website;
    const twitter = json.Data.General.Twitter;
    const baseURL = json.Data.SEO.BaseUrl !== null ? json.Data.SEO.BaseUrl : "https://www.cryptocompare.com";
    const misc = [];

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
            if(!(/^(?:[a-z]+:)?\/\//i.test(twitter.URL))){
                $("#twitter-content").attr('href', "https://twitter.com/" + twitter);
            }
            else {
                $("#twitter-content").attr('href', twitter.URL);
            }
            if(!(/[@]/gi.test(twitter))) {
                const username = '@'+twitter.USERNAME;
                $("#twitter-content").text(username);
            }
            $("#twitter-div").show()
        }
}

function canvasCharts(json) {
    const dates = json.map(entry => new Date(entry.time).toLocaleDateString());
    const prices = json.map(entry => parseFloat(entry.priceUsd).toFixed(2));

    // Chart.js setup
    const ctx = document.getElementById('price-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Price in USD',
                data: prices,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (USD)'
                    },
                    beginAtZero: false
                }
            }
        }
    });
}
