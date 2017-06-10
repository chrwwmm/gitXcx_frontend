/* Setup blank page controller */
angular.module('MetronicApp').controller('BlankController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
    $scope.$on('$viewContentLoaded', function() {   
        App.initAjax();

    });
}]);
