var map;
var states = [];
var roadsLayer;
var lastClickedState = null;
var infoWindow = new google.maps.InfoWindow();

var fusionTableWrapper = {
  call: function(tableId, fields, where, callbackName) {
    var script = document.createElement('script');
    var url = ['https://www.googleapis.com/fusiontables/v1/query?'];
    url.push('sql=');
    var query = 'SELECT ' + fields.join(', ') + ' FROM ' + tableId;
    if(where) {
      query += ' WHERE ' +  where;
    }
    var encodedQuery = encodeURIComponent(query);
    url.push(encodedQuery);
    url.push('&callback=' + callbackName);
    url.push('&key=AIzaSyCmJqyDLGq5UEcn0hpFO4hVhb5q74gVyLw');
    script.src = url.join('');
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(script);
  }
};

var mapUtil = {
  newCoordinates: function(polygon) {
    var newCoordinates = [];
    var coordinates = polygon['coordinates'][0];
    for (var i in coordinates) {
      newCoordinates.push(
          new google.maps.LatLng(coordinates[i][1], coordinates[i][0]));
    }
    return newCoordinates;
  },
  handleGeolocation: function (position) {
    var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    map.setCenter(center);
  },
  handleNoGeolocation: function() {
    console.log('no geolocation');
  },
  toggleStatesLayer: function(on) {
    _.each(states, function(s){
      s.polygon.setMap(on ? map : null);
    });

    if(infoWindow) {
      infoWindow.close();
    }
  }
};

function initialize() {
  google.maps.visualRefresh = true;

  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: new google.maps.LatLng(-14.989911309819053, -48.35657244067755),
    zoom: 5,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(mapUtil.handleGeolocation, mapUtil.handleNoGeolocation);
  }

  roadsLayer = new google.maps.FusionTablesLayer({
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

  var tableId = '189pHpNhpAHtZcI-cFMmT1foqdJrWSdLMIX70hXM';
  var fields = ['Text', 'Location', 'total'];
  fusionTableWrapper.call(tableId, fields, null, 'drawMap');
}

function drawMap(data) {
  var rows = data['rows'];
  for (var i in rows) {
    var stateName = rows[i][0];
    var geometries = rows[i][1]['geometries'];
    var total = parseInt(rows[i][2]);

    var coordinates = [];
    if (geometries) {
      for (var j in geometries) {
        coordinates.push(mapUtil.newCoordinates(geometries[j]));
      }
    } else {
      coordinates = mapUtil.newCoordinates(rows[i][1]['geometry']);
    }

    var oldRange = {min: 1246, max: 163111}; // min-max dos totais de acidente
    var newRange = {min: 0, max: 255};
    var oldRangeDiff = (oldRange.max - oldRange.min);
    var newRangeDiff = (newRange.max - newRange.min);
    var newValue = Math.floor((((total-oldRange.min)*newRangeDiff)/oldRangeDiff) + newRange.min);

    var R=newValue;
    var G=newRange.max-newValue;
    var B= 0;
    var rgb = 'rgb('+ R +','+ G +','+ B +')';

    var state = new google.maps.Polygon({
      paths: coordinates,
      strokeColor: '#555555',
      strokeOpacity: 1,
      strokeWeight: 1,
      fillColor: rgb,
      fillOpacity: 0.6,
      name: stateName
    });

    states.push({
      name: stateName,
      polygon: state
    });

    google.maps.event.addListener(state, 'mouseover', function() {
      this.setOptions({fillOpacity: 0.9});
    });

    google.maps.event.addListener(state, 'mouseout', function() {
      this.setOptions({fillOpacity: 0.6});
    });

    google.maps.event.addListener(state, 'click', function(e) {
      var tableId = '1VNAO2kw5Y6iryYPTlHihzM6_pvXsHGT8EIcocJY';
      var fields = ['ano', 'mes', 'causaAcidente', 'acidentes'];
      var where = "local = '" + this.name + "'";

      lastClickedState = {name: this.name, clickEvent: e};
      fusionTableWrapper.call(tableId, fields, where, 'openInfoWindow');
    });

    state.setMap(map);
  }
}

function openInfoWindow(fusionTableResponse) {
  var html = [];
  var evt = lastClickedState.clickEvent;

  // ano, mes, causa, total
  _.each(fusionTableResponse.rows, function(r){
    //console.log(r[0] + '-' + r[1] + ' => ' + r[2] + ': ' + r[3]);
  });

  var total = _.reduce(fusionTableResponse.rows, function(t, c){ return t + c[3];}, 0);

  html.push("<h3>"+ lastClickedState.name + "</h3>");
  html.push("<p><strong>Total:</strong> " + total + "</p>");
  html.push("<table class='ftTable'>");
  html.push("</table>");
  infoWindow.setOptions({
    content : html.join(""),
    position : evt.latLng,
    pixelOffset : evt.pixelOffset
  });
  infoWindow.open(map); 
};


var showRoads = false;
function changeViews() {
  var newVal = $('#showRoads').is(':checked');
  if(showRoads == newVal) return;
  else { showRoads = newVal };

  if(showRoads) {
    roadsLayer.setMap(map);
    mapUtil.toggleStatesLayer(false);
  } else {
    roadsLayer.setMap(null);
    mapUtil.toggleStatesLayer(true);
  }
}

google.maps.event.addDomListener(window, 'load', initialize);
