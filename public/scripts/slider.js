"use strict";
var slider = {
  init: function() {
    $('#slider').dateRangeSlider({
      bounds: {
        min: new Date(2007, 0, 1),
        max: new Date(2013, 6, 1)
      },
      defaultValues: {
        min: new Date(2007, 0, 1),
        max: new Date(2013, 6, 1)
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
  },
  getRange: function() {
    var dv = $('#slider').dateRangeSlider("values");
    var min = {
      year: dv.min.getFullYear(),
      month: dv.min.getMonth()+1
    };
    var max = {
      year: dv.max.getFullYear(),
      month: dv.max.getMonth()+1
    };

    return {min: min, max: max};
  }
};
