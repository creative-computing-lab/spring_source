var _ = require("lodash");

var UserFactory = function ($sessionStorage, $localStorage) {
  var set = function (_user) {$sessionStorage.user = _user};
  var setRoles = function(_roles) {
	  if($sessionStorage.user!=undefined) {
			$sessionStorage.user.roles = _roles
		}
  }

  var getUsername = function() {
    if($sessionStorage.user!=undefined) {
      if($sessionStorage.user.username!=undefined) {
        return $sessionStorage.user.username;
      }
    }
    return null;
  }

  var getName = function() {
	  if($sessionStorage.user!=undefined) {
			if($sessionStorage.user.display_name!=undefined) {
				return $sessionStorage.user.display_name;
			}
		}
		return null;
  }
  var getToken = function() {
	  if($sessionStorage.user!=undefined) {
			if($sessionStorage.user.access_token!=undefined) {
				return $sessionStorage.user.access_token;
			}
		}
		return null;
  }
  var setNewToken = function(newToken) {
	  if($sessionStorage.user==undefined) {
			$sessionStorage.user = {}
	  }
		$sessionStorage.user.authToken=newToken;
  }
  var getRoles = function() {
	  if($sessionStorage.user!=undefined) {
			if($sessionStorage.user.roles!=undefined) {
				return $sessionStorage.user.roles;
			}
		}
		return null;
  }

  var isLogin = function() {
	  return getToken() != null
  }
  var hasRole = function(role) {
	  var roles = getRoles();
		if(roles!=null) {
			return _.includes(roles, role)
		}
		return false;
  }
  var remove = function() {
	  delete $sessionStorage.user;
  }

  var saveId = function(_savedId) {
    $localStorage.savedId = _savedId;
  }

  var getSavedId = function() {
    if($localStorage.savedId!=undefined) {
  	  return $localStorage.savedId;
  	}
    return null;
  }

  var deleteSavedId = function() {
    delete $localStorage.savedId;
  }

  return { set:set, setRoles:setRoles, getUsername:getUsername, getName:getName, getToken:getToken, setNewToken:setNewToken, getRoles:getRoles, isLogin:isLogin, hasRole:hasRole, remove:remove, saveId:saveId, getSavedId:getSavedId, deleteSavedId:deleteSavedId };
};

module.exports = UserFactory;
