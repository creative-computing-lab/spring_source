var angular = require("angular");
var Cache = require("./cache/cache");
var Common = require("./common/common");
var Enum = require("./enum/enum");
var Http = require("./http/http");
var Template = require("./template/template");
var Toast = require("./toast/toast");
var User = require("./user/user");

var serviceModule = angular.module('app.service', [
  Cache.name,
  Common.name,
  Enum.name,
  Http.name,
  Template.name,
  Toast.name,
  User.name
]);

module.exports = serviceModule;
