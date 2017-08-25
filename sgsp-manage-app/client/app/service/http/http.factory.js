var HttpFactory = function ($rootScope, $http, $q, $cacheFactory, sUser, Upload) {
  var clearCache = function() {
    var cache = $cacheFactory.get('$http');
    cache.removeAll();
  }

  var get = function(url, params) {
    var deferred = $q.defer();

	  var authToken = sUser.getToken();
	  // disable IE ajax request caching
	  var headers = {
	  }
	  if(authToken!=null){
      headers['Authorization'] = "Bearer "+authToken;
    }
    var promise = $http({
	    method : 'GET',
      headers: headers,
	    url : __BASE_WAS_URL + url,
	    params : params
	  });
	  promise.then(function(response) {
	    if(response.data.resultCode!='0') {
	      deferred.reject(response.data.resultCode);
	    } else {
	      deferred.resolve(response.data.data);
	    }
	  }, function(response) {
	    if(url!='/auth/validate') {
	      if (response.status == 401 || response.status == 403) {
          $rootScope.$broadcast('xIllegalAccess');
        }
      }
      deferred.reject(status);
	  });
	  $rootScope._setLogoutTimeout();

    return deferred.promise;
	};

  var post = function(url, params, contentType) {
    var deferred = $q.defer();

    var contentType = contentType || 'application/x-www-form-urlencoded';
    var headers = {
	    'Content-Type' : contentType+'; charset=utf-8'
	  };
	  var authToken = sUser.getToken();
	  if(authToken!=null){
      headers['Authorization'] = "Bearer "+authToken;
    }

    var newParams = '';
    if(contentType=='application/json') {
      newParams = params;
    } else {
      if(typeof params == 'object') {
        if(Object.keys(params).length > 0) {
          newParams = $.param(params);
        }
      }
    }

    var promise = $http({
	    method : 'POST',
	    headers: headers,
	    url : __BASE_WAS_URL + url,
	    data  : newParams
	  })
    promise.then(function(response) {
      if(url.startsWith('sec/')) {      
        deferred.resolve(response.data);
      } else {
        if(response.data.resultCode!='0') {
          deferred.reject(response.data.data);
        } else {
          clearCache();
          deferred.resolve(response.data.data);
        }
      }
    }, function(response) {
      if(url!='sec/validate') {
	      if (response.status == 401 || response.status == 403) {
          $rootScope.$broadcast('xIllegalAccess');
        }
      }
      deferred.reject(response.status);
	  })

    return deferred.promise;
	};

  var login = function(id, password, idSave) {
    var idSave = idSave || false;
    if(idSave) {
  	  sUser.saveId(id);
  	} else {
  	  sUser.deleteSavedId();
  	}
	  post('sec/login', {'name':id, 'pwd':password}, 'application/json').then(function(data) {
		   sUser.set(data);
		   $rootScope.$broadcast('xLoginSuccess');
    }, function() {
		   $rootScope.$broadcast('xLoginError');
	  })
  }

  var logout = function() {
    var token = sUser.getToken();
    if(token!=null) {
      post('sec/logout');
    }

    sUser.remove();
    clearCache();
    $rootScope.$broadcast('xLogoutSuccess');
  }

  var validate = function(newToken) {
	    var token = sUser.getToken();
		  if(token != null) {
			post('sec/validate').then(function(data){
				sUser.set(data);
				$rootScope.$broadcast('xValidateSuccess');
			}, function(){
				sUser.remove();
				clearCache();
				$rootScope.$broadcast('xValidateError');
		  })
    }
  }

  var list = function(url, offset, max, SearchParams) {
    var listParams = {'offset':offset, 'max':max};
    var params = _.merge(listParams, SearchParams);
    return get(url, params);
  }

  var uploadFileEach = function (url, file) {
    var uploadPromise = Upload.upload({
      headers: {'Authorization' : "Bearer "+sUser.getToken()},
        url: __BASE_WAS_URL+url,
        file: file
    });
    uploadPromise.then(function(response) {
      if(response.data.resultCode=='0') {
        console.log('file uploaded. '+response.data.data.id);
      } else {
        console.log('file upload failed. '+response.data.resultCode);
      }
      //response.data.data.key = key;
    });
    return uploadPromise;
  }

  function uploadFile (url, uploadArray) {
    var deferred = $q.defer();
      if (uploadArray) {
        var promises = [];
        var index = 0;
        _.forEach(uploadArray, function(upload) {
          if(upload!=null) {
            promises[index++] = uploadFileEach(url, upload);
          }
        });

        $q.all(promises).then(function(responseList) {
          //console.log(JSON.stringify(responseList));
          var resultData = [];
          _.forEach(responseList, function(response) {
            if(response.data.resultCode=='0') {
              resultData.push(response.data.data.id);
            } else {
              deferred.reject(response.data.resultCode);
            }
          })
          deferred.resolve({'files':resultData.join(';')});
        }, function(response) {
          var status = response.status || 'error';
          console.log('all error status: ' + status);
          deferred.reject(status);
        });
      } else {
        deferred.reject("no files");
      }
      return deferred.promise;
  }

  return { clearCache:clearCache, get:get, post:post, login:login, logout:logout, validate:validate, list:list, uploadFile:uploadFile};
}

module.exports = HttpFactory;
