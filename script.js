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