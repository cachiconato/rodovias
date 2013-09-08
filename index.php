<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <title>Fusion Tables heatmaps</title>
    <style type="text/css">
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#map-canvas, #map_canvas {
  height: 100%;
}

@media print {
  html, body {
    height: auto;
  }

  #map-canvas, #map_canvas {
    height: 650px;
  }
}

#panel {
  position: absolute;
  top: 5px;
  left: 50%;
  margin-left: -180px;
  z-index: 5;
  background-color: #fff;
  padding: 5px;
  border: 1px solid #999;
}

    </style>
    <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
    <script>
function initialize() {

  var brazil = new google.maps.LatLng(-18.771115, -42.758789);

  var map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: brazil,
    zoom: 5,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var layer = new google.maps.FusionTablesLayer({
    query: {
      select: 'col1',
      from: '1lgEWgtJ9YE8ftmoxZf-eiD8t6a0mwFZOSynU5lU',
      where: "col0 contains ignoring case 'BR-'"
    },
    styleId: 2,
    templateId: 2,
    ui_token: 'AIGcsfNKJ-n4J5_o5f5nZSUjB18uxsG1oQ',
    heatmap: {enabled: false}
  });

  layer.setMap(map);

  google.maps.event.addListener(layer, 'click', function () {
      console.log('layer click');
  });
}

google.maps.event.addDomListener(window, 'load', initialize);

    </script>
  </head>
  <body>
    <div id="map-canvas"></div>
  </body>
</html>
