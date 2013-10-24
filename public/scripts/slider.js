"use strict";
var sliderManager = {
  init: function() {
    $('#slider').dateRangeSlider({
      bounds: {
        min: new Date(2007, 0, 1),
        max: new Date(2013, 5, 30)
      },
      defaultValues: {
        min: new Date(2007, 0, 1),
        max: new Date(2013, 5, 30)
      },
      formatter: function(val) {
        var month = val.getMonth() + 1;
        var year  = val.getFullYear();
        return month + '-' + year;
      },
      arrows: false,
      step: {
        months: 1
      }
    });
  },
  destroy: function() {
    $('#slider').dateRangeSlider("destroy");
  }
};

