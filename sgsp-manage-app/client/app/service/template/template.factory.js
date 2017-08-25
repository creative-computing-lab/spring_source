var TemplateFactory = function ($templateCache) {
  $templateCache.put("template/pagination/pagination.html",
    "<div class=\"paging\">\n" +
    "<ul>\n" +
    "  <li ng-if=\"boundaryLinks\" ng-class=\"{disabled: noPrevious()}\"><a class=\"first\" href ng-click=\"selectPage(1)\">{{getText('first')}}</a></li>\n" +
    "  <li ng-if=\"directionLinks\" ng-class=\"{disabled: noPrevious()}\"><a class=\"prev\" href ng-click=\"selectPage(page - 1)\">{{getText('previous')}}</a></li>\n" +
    "  <li ng-repeat-start=\"page in pages track by $index\"><a ng-class=\"{on: page.active}\" href ng-click=\"selectPage(page.number)\">{{page.text}}</a></li>\n" +
    "  <span ng-repeat-end></span>\n" +
    "  <li ng-if=\"directionLinks\" ng-class=\"{disabled: noNext()}\"><a class=\"next\" href ng-click=\"selectPage(page + 1)\">{{getText('next')}}</a></li>\n" +
    "  <li ng-if=\"boundaryLinks\" ng-class=\"{disabled: noNext()}\"><a class=\"last\" href ng-click=\"selectPage(totalPages)\">{{getText('last')}}</a></li>\n" +
    "</ul>\n"+
    "</div>");
};

module.exports = TemplateFactory;
