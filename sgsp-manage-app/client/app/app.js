var $ = require("jquery");
window.$ = $;
window.jQuery = $;

var angular = require("angular");
require("angular/angular-csp.css")
require("angular-animate");
require("angular-sanitize");
var uiRouter = require("angular-ui-router");
//require("normalize.css");
require("bootstrap/dist/css/bootstrap.min.css");
require("angular-i18n/angular-locale_ko-kr.js");
require("angular-ui-bootstrap/dist/ui-bootstrap-tpls.js");
require("angular-ui-event");
//require("font-awesome/css/font-awesome.css");

/* */
require("angular-strap/dist/modules/compiler.js");
require("angular-strap/dist/modules/date-parser.js");
require("angular-strap/dist/modules/date-formatter.js");
require("angular-strap/dist/modules/dimensions.js");
require("angular-strap/dist/modules/tooltip.js");
require("angular-strap/dist/modules/tooltip.tpl.js");
require("angular-strap/dist/modules/datepicker.js");
require("angular-strap/dist/modules/datepicker.tpl.js");
require("angular-strap/dist/modules/timepicker.js");
require("angular-strap/dist/modules/timepicker.tpl.js");
require("bootstrap-additions/dist/bootstrap-additions.css");
/* */

var Common = require("./common/common");
var Service = require("./service/service");
var Components = require("./components/components");
var AppComponent = require("./app.component");

angular.module('app', [
  uiRouter,
  'ui.bootstrap',
  'mgcrea.ngStrap.datepicker',
  'mgcrea.ngStrap.timepicker',
  Common.name,
  Service.name,
  Components.name
])

.directive('app', AppComponent)

.config(function($urlRouterProvider) {
	$urlRouterProvider.otherwise('/');
})

.config(function($httpProvider) {
    $httpProvider.interceptors.push(function($q, $rootScope) {
    	return {
    		'request': function(config) { $rootScope.$broadcast("xHttpStart"); return config || $q.when(config); },
    		'response' : function(response) { $rootScope.$broadcast("xHttpEnd"); return response; },
    		'responseError': function(rejection) { $rootScope.$broadcast("xHttpEnd"); return $q.reject(rejection); }
    	};
    });
})

.config(function(ngToastProvider)  {
  ngToastProvider.configure({
    animation: 'slide',//'fade',
    horizontalPosition: 'center'
  });
})

.run(function(uibPaginationConfig)  {
  uibPaginationConfig.maxSize = 10;
  uibPaginationConfig.itemsPerPage = 10;
  uibPaginationConfig.boundaryLinks = true;
  uibPaginationConfig.directionLinks = true;
  uibPaginationConfig.firstText = "«";
  uibPaginationConfig.previousText = "‹";
  uibPaginationConfig.nextText = '›';
  uibPaginationConfig.lastText = '»';
})

.config(function($datepickerProvider) {
  angular.extend($datepickerProvider.defaults, {
    dateType: 'string',
    dateFormat: 'yyyy-MM-dd',
    modelDateFormat : 'yyyyMMdd',
    monthTitleFormat: 'yyyy MMMM',
    autoclose : true
  });
})

.config(function($timepickerProvider) {
  angular.extend($timepickerProvider.defaults, {
    timeType : 'string',
    timeFormat: 'h:mm a',
    modelTimeFormat : 'HHmm',
    autoclose : true
  });
})

.run(function($rootScope, $state, $timeout, sUser, sHttp, sCache)  {
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
    $rootScope.$broadcast("xPause", fromState.name);

	  console.log(fromState.name+" ==> "+toState.name);
		if(toState.name=='login') {
			$rootScope._next = null;
			$rootScope._nextParams = null;
		  if(sUser.isLogin()){
				$state.go("user_list", null, {'location':'replace'})
				event.preventDefault();
			}
		}
		else if(toState.role!=undefined) {
			//console.log("request : "+toState.role);
			if(sUser.isLogin()) {
				if(sUser.hasRole(toState.role)==false) {
					$state.go("denied", null, {'location':'replace'});
					event.preventDefault();
				}
			} else {
				$rootScope._next = toState.name;
				$rootScope._nextParams = toParams
				$state.go('login')
				event.preventDefault();
			}
		}
	});
	$rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
		$rootScope._setLogoutTimeout();
		if(toState.name=='user_list') {
			// 메인화면  로그인이 유효한지 체크 -> xValidateSuccess나 xValidateError 이벤트 발생
			sHttp.validate();
			sCache.reset();
		}
		//
		$timeout(function() {
      $rootScope.$broadcast("xResume", toState.name);
    }, 1);
	});
	$rootScope.$on("xLoginSuccess", function()  {
		//console.log("xLoginSuccess");
		var next = "user_list";
		var nextParams = null;
		if ($rootScope._next != undefined) {
			next = $rootScope._next;
			nextParams = $rootScope._nextParams;
		}
		$state.go(next, nextParams, {'location':'replace'})
	})
	$rootScope.$on("xLogoutSuccess", function()  {
		$rootScope._next = null;
		$rootScope._nextParams = null;
		if(!$state.is("login")) {
			$state.go("login", null, {'location':'replace'})
		}
	})

	$rootScope.$on("xIllegalAccess", function() {
		//console.log("xIllegalAccess");
		if(!$state.is("main")) {
			$state.go("main", null, {'location':'replace'})
		}
	})
})

// rootScope set
.run( function ($rootScope, $window, $timeout, sUser, sHttp)  {
	$rootScope._goBack = function()  {
		$window.history.back();
	};
	$rootScope._setLogoutTimeout = function () {
		if($rootScope.logoutTimer!=null) {
			$timeout.cancel($rootScope.logoutTimer);
		}
		if(sUser.isLogin()) {
			//console.log("logoutTimer set~");
			$rootScope.logoutTimer = $timeout( function() {
				sHttp.logout();
			}, 1000*60*30);
		}
	}
})
;
