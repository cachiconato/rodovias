nv.addGraph(function() {  
  var chart = nv.models.discreteBarChart()
    .x(function(d) { return d.x })
    .y(function(d) { return d.y })
    .staggerLabels(true)
    .color(['#aec7e8', '#7b94b5', '#486192'])
    .transitionDuration(50);

  d3.select('#chart1 svg')
      .datum(exampleData())
      .call(chart);

  nv.utils.windowResize(chart.update);

  return chart;
});


function exampleData() {
  return [{
    values: [{
        x: "Jan 10",
        y: 10
    }, {
        x: "Fev 10",
        y: 100
    }, {
        x: "Mar 10",
        y: 300
    }, {
        x: "Abr 10",
        y: 50
    }, {
        x: "Mai 10",
        y: 300
    }, {
        x: "Jun 10",
        y: 89
    }, {
        x: "Jul 10",
        y: 210
    }, {
        x: "Ago 10",
        y: 100
    }, {
        x: "Set 10",
        y: 3
    }, {
        x: "Out 10",
        y: 333
    }, {
        x: "Nov 10",
        y: 255
    }, {
        x: "Dez 10",
        y: 145
    }, {
        x: "Jan 11",
        y: 129
    }, {
        x: "Fev 11",
        y: 66
    }, {
        x: "Mar 11",
        y: 87
    }, {
        x: "Abr 11",
        y: 245
    }, {
        x: "Mai 11",
        y: 100
    }, {
        x: "Jun 11",
        y: 44
    }, {
        x: "Jul 11",
        y: 122
    }, {
        x: "Ago 11",
        y: 76
    }, {
        x: "Set 11",
        y: 123
    }, {
        x: "Out 11",
        y: 76
    }, {
        x: "Nov 11",
        y: 0
    }, {
        x: "Dez 11",
        y: 10
    }, {
        x: "Jan 12",
        y: 298
    }, {
        x: "Fev 12",
        y: 276
    }, {
        x: "Mar 12",
        y: 176
    }, {
        x: "Abr 12",
        y: 50
    }, {
        x: "Mai 12",
        y: 90
    }, {
        x: "Jun 12",
        y: 213
    }, {
        x: "Jul 12",
        y: 12
    }, {
        x: "Ago 12",
        y: 10
    }, {
        x: "Set 12",
        y: 100
    }, {
        x: "Out 12",
        y: 0
    }, {
        x: "Nov 12",
        y: 150
    }, {
        x: "Dec 12",
        y: 160
    }]
  }]
}
