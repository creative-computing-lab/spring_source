var CacheFactory = function ($cacheFactory) {
  var _cache;

	var getCache = function() {
		if(_cache==undefined){
			_cache = $cacheFactory("bsmap");
		}
		return _cache;
	}

	var get = function(name, key, originalValue) {
    var cache = getCache();
    var value = cache.get(name+":"+key);
    if(value==undefined) {
      return originalValue;
    }
    return value
  }

  var put = function(name, key, value) {
    var cache = getCache();
    if(value!=undefined) {
      cache.put(name+":"+key, value);
    }
  }

  var reset = function() {
    getCache().removeAll();
  }

	return {
		get : get,
		put : put,
		reset : reset
	}
};

module.exports = CacheFactory;
