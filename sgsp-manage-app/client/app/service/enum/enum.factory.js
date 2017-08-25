var EnumFactory = function (sHttp, $q) {
	var cacheData = {}

	return {
		getSendStatus: function () {
			var deferred = $q.defer();
			if (cacheData['sendStatus'] != undefined) {
				deferred.resolve(cacheData['sendStatus'])
			} else {
				sHttp.get('code/sendStatus').then(function (data) {
					cacheData['sendStatus'] = data;
					deferred.resolve(data);
				});
			}
			return deferred.promise;
		},

		getSendStatusValue: function (key) {
			var deferred = $q.defer();
			this.getSendStatus().then(function (data) {
				var result = "";
				for (var i of data) {
					if (i.key == key) { result = i.value; break; }
				}
				deferred.resolve(result);
			});
			return deferred.promise;
		},

		getToType: function () {
			var deferred = $q.defer();
			if (cacheData['toType'] != undefined) {
				deferred.resolve(cacheData['toType'])
			} else {
				sHttp.get('code/toType').then(function (data) {
					cacheData['toType'] = data;
					deferred.resolve(data);
				});
			}
			return deferred.promise;
		},

		getToTypeValue: function (key) {
			var deferred = $q.defer();

			this.getToType().then(function (data) {
				var result = "";
				for (var i of data) {
					if (i.key == key) { result = i.value; break; }
				}
				deferred.resolve(result);
			});
			return deferred.promise;
		},

		getPushMessageType : function () {
			var deferred = $q.defer();
			if (cacheData['pushMessageType'] != undefined) {
				deferred.resolve(cacheData['pushMessageType'])
			} else {
				var data = [{'key' : 'TEXT', 'value' : '단순 메시지'}, {'key' : 'LINK', 'value' : '링크 메시지'}];
				cacheData['pushMessageType'] = data;
				deferred.resolve(data);				
			}
			return deferred.promise;
		},
		getPushMessageTypeValue: function (key) {
			var deferred = $q.defer();

			this.getPushMessageType().then(function (data) {
				var result = "";
				for (var i of data) {
					if (i.key == key) { result = i.value; break; }
				}
				deferred.resolve(result);
			});
			return deferred.promise;
		}
	}
};
module.exports = EnumFactory;
