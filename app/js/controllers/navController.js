angular.module('bankMoreApp')
    .controller('NavController', ['$scope', 'AuthService', function($scope, AuthService) {
        
        $scope.isAuthenticated = function() {
            return AuthService.isAuthenticated();
        };

        $scope.logout = function() {
            AuthService.logout();
        };
    }]);
