var angular = require("angular");
var uiRouter = require("angular-ui-router");
var template = require('./list_base.html');

var MainMain = require("./main/main/main");
var MainDenied = require("./main/denied/denied");
var MainLogin = require("./main/login/login");
var MainChgpwd = require("./main/chgpwd/chgpwd");

var UserUserList = require("./user/user_list/user_list");
var OpposeUserList = require("./oppose/oppose_list/oppose_list");
var OpposeItem = require("./oppose/oppose_item/oppose_item");
var RecomCodeList = require("./recomcode/recomcode_list/recomcode_list");
var RecomCodeItem = require("./recomcode/recomcode_item/recomcode_item");
var PushList = require("./push/push_list/push_list");
var PushSend = require("./push/push_send/push_send");

var MoodList = require("./mood/mood_list/mood_list");

var componentModule = angular.module('app.components', [
  uiRouter,
  MainMain.name,
  MainDenied.name,
  MainLogin.name,
  MainChgpwd.name,
  UserUserList.name,
  OpposeUserList.name,
  OpposeItem.name,
  RecomCodeList.name,
  RecomCodeItem.name,
  PushList.name,
  PushSend.name,
  MoodList.name
])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('list_root', {
    abstract : true,
    template: template
  });
}])
;
module.exports = componentModule;
