var map;
var states = [];
var roadsLayer;
var showRoads = false;

function initialize() {
  google.maps.visualRefresh = true;

  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: new google.maps.LatLng(-14.989911309819053, -48.35657244067755),
    zoom: 5,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  function handleGeolocation(position) {
    var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    map.setCenter(center);
  }

  function handleNoGeolocation() {
    console.log('no geolocation');
  }

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handleGeolocation, handleNoGeolocation);
  }

  roadsLayer = new google.maps.FusionTablesLayer({
    map: null,
    query: {
      select: "geom",
      from: "1KOwur7icdQlzaXN3yJ7QB9zMyxxMhSIkGIjuEEM"
    },
    options: {
      styleId: 2,
      templateId: 2
    },
    heatmap: {enabled: false}
  });

  google.maps.event.addListener(map, 'zoom_changed', function() {
    var zoomLevel = map.getZoom();

    console.log('zoom_changed => ' + zoomLevel);
    //if (zoomLevel > 5) {
    //  toggleStatesLayer(false);
    //  roadsLayer.setMap(map);
    //} else {
    //  toggleStatesLayer(true);
    //  roadsLayer.setMap(null);
    //}
  });

  /** 
  google.maps.event.addListener(layer, "click", function(evt) {
    openInfoWindow(evt);
  });

  google.maps.event.addListener(layer, 'click', function (evt) {
      console.log(evt);
  });

  var popup = new google.maps.InfoWindow();
  var openInfoWindow = function(evt) {
    var html = [];
    html.push("<h3> Estatisticas</h3>");
    html.push("<table class='ftTable'>");
    //for (var field in ftMouseEvt.row) {
      html.push("<tr><th>" + "Numero de acidentes" + "</th><td>" + evt.row.total.value + "</td></tr>");
    //}
    html.push("</table>");
    popup.setOptions({
      content : html.join(""),
      position : evt.latLng,
      pixelOffset : evt.pixelOffset
    });
    popup.open(map); 
  };
  */

  initRequest();
}

function initRequest() {
  var script = document.createElement('script');
  var url = ['https://www.googleapis.com/fusiontables/v1/query?'];
  url.push('sql=');
  var query = 'SELECT Text, Location, total FROM ' +
      '189pHpNhpAHtZcI-cFMmT1foqdJrWSdLMIX70hXM';
  var encodedQuery = encodeURIComponent(query);
  url.push(encodedQuery);
  url.push('&callback=drawMap');
  url.push('&key=AIzaSyCmJqyDLGq5UEcn0hpFO4hVhb5q74gVyLw');
  script.src = url.join('');
  var body = document.getElementsByTagName('body')[0];
  body.appendChild(script);
};

function drawMap(data) {
  var rows = data['rows'];
  for (var i in rows) {
    var stateName = rows[i][0];
    var geometries = rows[i][1]['geometries'];
    var total = rows[i][2];

    var newCoordinates = [];
    if (geometries) {
      for (var j in geometries) {
        newCoordinates.push(constructNewCoordinates(geometries[j]));
      }
    } else {
      newCoordinates = constructNewCoordinates(rows[i][1]['geometry']);
    }

    // TODO: fix this shit
    var n= Math.floor(total/1000);
    if(n>100) n= 100;
    var R= Math.floor((255*n)/100);
    var G= Math.floor((255*(100-n))/100);
    var B= 0;
    var rgb = 'rgb('+ R +','+ G +','+ B +')';

    var state = new google.maps.Polygon({
      paths: newCoordinates,
      strokeColor: '#FF0000',
      strokeOpacity: 0,
      strokeWeight: 1,
      fillColor: rgb,
      fillOpacity: 0.6
    });

    states.push({
      name: stateName,
      polygon: state
    });

    google.maps.event.addListener(state, 'mouseover', function() {
      var _this = this;
      var overMe = _.find(states, function(s){ 
        return s.polygon === _this;
      });
      $('.popup').html('<h1>' + overMe.name + '</h1>').show();

      this.setOptions({fillOpacity: 0.9});
    });

    google.maps.event.addListener(state, 'mouseout', function() {
      this.setOptions({fillOpacity: 0.6});
      $('.popup').hide();
    });

    state.setMap(map);
  }
}

function constructNewCoordinates(polygon) {
  var newCoordinates = [];
  var coordinates = polygon['coordinates'][0];
  for (var i in coordinates) {
    newCoordinates.push(
        new google.maps.LatLng(coordinates[i][1], coordinates[i][0]));
  }
  return newCoordinates;
}

function toggleStatesLayer(on) {
  _.each(states, function(s){
    s.polygon.setMap(on ? map : null);
  });
}

function changeViews() {
  var newVal = $('#showRoads').is(':checked');
  if(showRoads == newVal) return;
  else { showRoads = newVal };

  if(showRoads) {
    roadsLayer.setMap(map);
    toggleStatesLayer(false);
  } else {
    roadsLayer.setMap(null);
    toggleStatesLayer(true);
  }
}

google.maps.event.addDomListener(window, 'load', initialize);
