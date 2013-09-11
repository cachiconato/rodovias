function initialize() {
  google.maps.visualRefresh = true;
  var map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: new google.maps.LatLng(-14.989911309819053, -48.35657244067755),
    zoom: 5,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  layer = new google.maps.FusionTablesLayer({
    map: map,
    heatmap: { enabled: false },
    query: {
      select: "col2\x3e\x3e1",
      from: "1I72VZY6R-nFEBN-UNhlI17HCB2D3OGfUQlunGvo",
      where: ""
    },
    options: {
      styleId: 2,
      templateId: 2
    }
  });

  var secondLayer = new google.maps.FusionTablesLayer({
    query: {
      select: "col1\x3e\x3e1",
      from: "1KOwur7icdQlzaXN3yJ7QB9zMyxxMhSIkGIjuEEM",
      where: ""
    },
    options: {
      styleId: 2,
      templateId: 2
    },
    heatmap: {enabled: false}
  });
  
  secondLayer.setMap(null);

  google.maps.event.addListener(map, 'zoom_changed', function() {
    var zoomLevel = map.getZoom();

    if (zoomLevel > 5) {
      layer.setMap(null);
      secondLayer.setMap(map);
    } else {
      layer.setMap(map);
      secondLayer.setMap(null);
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
