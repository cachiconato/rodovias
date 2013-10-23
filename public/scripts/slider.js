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
    step: {
      months: 1
    }
  });

});
