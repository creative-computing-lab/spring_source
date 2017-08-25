var currency = function() {
  return {
    restrict : 'A',
    require : 'ngModel',
    link : function(scope, element, attr, ctrl) {
      ctrl.$formatters.push(format);
      ctrl.$parsers.push(function(viewValue) {
        var value = parseFloat(viewValue.replace(new RegExp(",", "g"), ''));
        if(isNaN(value)) {value = 0;}
        return value;
      });
      element.bind("change", function() {
        if (ctrl.$invalid)	return;
        var formattedModel = format(ctrl.$modelValue);
        if (formattedModel !== ctrl.$viewValue) {
          element.val(formattedModel);
        }
      });
      function format(modelValue) {
        if(modelValue!=undefined) {
          return modelValue.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
        } else {
          return '';
        }
      }
    }
  };
};

var numbersOnly = function() {
  return {
    require : 'ngModel',
    link : function(scope, element, attr, ctrl) {
    ctrl.$parsers.push(function(viewValue) {
      if( viewValue == undefined ){
        return '';
      }
      var transFormedInput = viewValue.replace(/[^0-9.]/g,'');
      if( transFormedInput != viewValue ){
        ctrl.$setViewValue(transFormedInput);
        ctrl.$render();
      }
      return transFormedInput;
    });
    }
  };
};

var equal = function() {
  return {
    require : 'ngModel',
    link : function(scope, element, attrs, ctrl) {
      scope.$watch(attrs.ngModel, function() {
        var targetValue = attrs.equal
        var value = element.val()
        ctrl.$setValidity('equal', targetValue==value);
      });
    }
  }
};

module.exports.currency = currency
module.exports.numbersOnly = numbersOnly;
module.exports.equal = equal;

