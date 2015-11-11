/**
 * Created by NE_LEADER on 2015. 10. 8..
 */

angular.module('honeyqa')
    .directive("ctoggle", function() {
        return {
            scope: {
                model: "=ngModel"
            },
            link: function (scope, element, attrs) {
                element.bind('click', function () {
                    scope.model = !scope.model;
                    scope.$apply();
                });
            }
        }
    });