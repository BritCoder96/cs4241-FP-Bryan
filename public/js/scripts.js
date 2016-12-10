var analyticsData = []
$(document).ready(function(){
    $("#analytics").hide();
})
var sortEnum = [
    "name",
    "size",
    "orbital_period",
    "climate",
    "terrain",
    "population",
    "rotation_period"
];
function sort(key){
    console.log("Sorting with: " + key);
    var oReq = new XMLHttpRequest();

    oReq.addEventListener("load", reqListener);

    oReq.open("POST", "/sort", true);

    oReq.send('sortBy=' + sortEnum[key])
}

function reqListener() {
    getMyTable();
}

function getMyTable() {
    function reqListener(){
        $("#table").html(this.responseText)
    }

    var oReq = new XMLHttpRequest();

    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "/tblReq");
    oReq.send();
}

function searchPlanets() {
  var searchPlanets = document.getElementById('search_planets')
  
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);

  oReq.open("POST", "/searchPlanets", true);

  oReq.send('search=' + searchPlanets.value)

}

function beginAnalytics(){
    $("#table").hide();
    $("#analytics").show();
}

function displayAnalytics(key){
    beginAnalytics()
    var oReq = new XMLHttpRequest();
    function reqListener(){    
        google.charts.load('current', {packages: ['corechart', 'bar']});
        analyticsData = JSON.parse(this.responseText).analytics
        google.charts.setOnLoadCallback(drawStacked);
    }
    oReq.addEventListener("load", reqListener);

    oReq.open("POST", "/displayAnalytics", true);

    oReq.send('type=' + sortEnum[key])

}



function displayTable(){
    $("#analytics").hide();
    $("#table").show();
}


function drawStacked() {

  var data = google.visualization.arrayToDataTable(
    analyticsData
  );

  var options = {
    title: "An Analysis of Planet Names by: " + analyticsData[0][1],
    chartArea: {width: '70%', height: '85%', backgroundColor: '#FFFFFF'},
    backgroundColor: '#bfbfbf',
    colors : ['#CC7C5D'],

    isStacked: true,
    hAxis: {
      title: analyticsData[0][1],
      minValue: 0,
    },
    vAxis: {
      title: "Planet Names"
    },
    legend: "none"
  };
  var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}
