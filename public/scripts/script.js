var map;
var states = [];

function initializeGraph(data) {
  nv.addGraph(function() {
    var chart = nv.models.stackedAreaChart()
                  .x(function(d) { return d.x; })
                  .y(function(d) { return d.y; })
                  .useInteractiveGuideline(true)
                  .controlsData(['Stacked', 'Expanded'])
                  .controlLabels({stacked: 'Empilhado', stream: 'Stream', expanded: 'Expandido'})
                  .tooltips(true)
                  .clipEdge(true);


    chart.xAxis.tickFormat(function(d) { return d3.time.format('%m-%Y')(new Date(d)) });
    chart.yAxis.axisLabel("Número de acidentes");
    chart.yAxis.tickFormat(d3.format(',.0f'));
    chart.margin({left: 80});

  $('#chart-overlay svg').empty();
  d3.select('#chart-overlay svg')
    .append("text")
    .attr("x", 20)
    .attr("y", 20)
    .attr("text-anchor", "middle")  
    .text(mapUtil.selectedState);

    d3.select('#chart-overlay svg')
        .datum(data)
        .transition().duration(500)
        .call(chart);


    nv.utils.windowResize(chart.update);

    return chart;
  });
}

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
  selectState: function(state) {
      this.selectedState = state;
  },
  isSelected: function(state) {
    return this.selectedState === state;  
  },
  getRGB: function(value) {
    var rainbow = new Rainbow(); 
    rainbow.setNumberRange(1246, 163111);
    //rainbow.setSpectrum('#FFFFB2', '#FECC5C', '#FD8D3C', '#E31A1C'); //yellow
    rainbow.setSpectrum('#FFFFCC', '#C2E699', '#78C679', '#238443'); //greens
    return '#' + rainbow.colourAt(value);
  },
  toggleStatesLayer: function(on) {
    _.each(states, function(s){
      s.polygon.setMap(on ? map : null);
    });

    if(!on){
      $('#map-canvas').css('height', '100%');
      $('#chart-overlay').hide();
      google.maps.event.trigger(map, 'resize');
    }
  },
  toggleRoadsLayer: function(on) {
    this.roadsLayer.setMap(on ? map : null);
  }
};

function initialize() {
  google.maps.visualRefresh = true;

  createSpinner('map-spinner');

  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: new google.maps.LatLng(-14.989911309819053, -48.35657244067755),
    zoom: 5,
    minZoom: 4,
    maxZoom: 10,
    mapTypeControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  mapUtil.roadsLayer = new google.maps.FusionTablesLayer({
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

    var state = new google.maps.Polygon({
      paths: coordinates,
      strokeColor: '#555555',
      strokeOpacity: 0.6,
      strokeWeight: 1,
      fillColor: mapUtil.getRGB(total),
      fillOpacity: 0.6,
      name: stateName
    });

    states.push({
      name: stateName,
      polygon: state
    });

    google.maps.event.addListener(state, 'mouseover', function() {
      this.setOptions({strokeWeight: 2.5});
    });

    google.maps.event.addListener(state, 'mouseout', function() {
      if(mapUtil.isSelected(this.name)) { return; }
      this.setOptions({strokeWeight: 1});
    });

    google.maps.event.addListener(state, 'click', function(e) {
      var tableId = '1za9lKRkUO7WKwUhdwcLpAa8CDZLqKgvtHM7YCk0';
      var fields = ['ano', 'mes', 'causaAcidente', 'acidentes'];
      var where = "local = '" + this.name + "'";

      showPopUp(e);

      // highlight clicked state
      _.each(states, function(s) { s.polygon.setOptions({strokeWeight: 1, strokeColor: '#555555'});});
      this.setOptions({strokeWeight: 2.5, strokeColor: '#000000'});

      //selectedState = {name: this.name, clickEvent: e};
      mapUtil.selectState(this.name);
      fusionTableWrapper.call(tableId, fields, where, 'openGraphWindow');
    });

    state.setMap(map);
  }

  stopSpinning('map-spinner');
}

function openGraphWindow(fusionTableResponse) {
  $('#chart-overlay').show();
  $('#map-canvas').css('height', '60%');

  // fusionTableResponse.rows => ano, mes, causa, total
  var causas = _.uniq(_.map(fusionTableResponse.rows, function(r){ return r[2] || 'desconhecido'; }));
  var causasData = _.map(causas, function(causa) {
    var causaEntries = _.filter(fusionTableResponse.rows, function(r) {
      return r[2] == causa;
    });

    var dataPoints = _.map(causaEntries, function(e){
      var time = e[0] + e[1];
      var totalAcidentes = e[3];
      return [time, totalAcidentes];
    });

    var anos  = ['2007', '2008', '2009', '2010', '2011', '2012', '2013'];
    var range = _.compact(_.flatten(
      _.map(anos, function(ano){
        return _.map(['1','2','3','4','5','6','7','8','9','10','11','12'], function(mes) {
          //lixo
          var mesInt = parseInt(mes);
          if(ano == '2013' && mesInt > 6)
            return null;

          var dateTimeStr = (mesInt < 10 ? '0'+mes : mes) + '-' + ano;
          var dateTime = d3.time.format("%m-%Y").parse(dateTimeStr);

          var val = _.find(causaEntries, function(c){
            return c[0] == ano && c[1] == mes;
          });
          
          var total = val ? parseInt(val[3]) : 0;

          return { x: dateTime.getTime(), y: total };
        });
      })
    ));

    return {
      key: causa, 
      values: range
    };
  });

  var total = _.reduce(fusionTableResponse.rows, function(t, c){ return t + c[3];}, 0);
  initializeGraph(causasData);
};

var showRoads = false;
function changeViews() {
  var newVal = $('#showRoads').is(':checked');
  if(showRoads == newVal) return;
  else { showRoads = newVal };

  mapUtil.toggleRoadsLayer(showRoads);
  mapUtil.toggleStatesLayer(!showRoads);
}


function createSpinner(containerId) {
  var opts = {
      lines: 13, // The number of lines to draw
      length: 20, // The length of each line
      width: 10, // The line thickness
      radius: 30, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#000', // #rgb or #rrggbb or array of colors
      speed: 1, // Rounds per second
      trail: 60, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: 'auto', // Top position relative to parent in px
      left: 'auto' // Left position relative to parent in px
  };
  var target = document.getElementById(containerId);
  $('#' + containerId).show();
  return new Spinner(opts).spin(target);
}

function stopSpinning(containerId) {
  $(containerId).stop();
  $('#' + containerId).hide();
}

var infoWindow = new google.maps.InfoWindow();
function showPopUp(clickEvent) {
  var html = '<h1>titulo</h1>';
  infoWindow.setOptions({
    content:  html,
    position : clickEvent.latLng,
    pixelOffset : clickEvent.pixelOffset
  });
  infoWindow.open(map);
}

google.maps.event.addDomListener(window, 'load', initialize);
