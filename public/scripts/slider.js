"use strict";
$(function(){
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
    step: {
      months: 1
    }
  });

});
