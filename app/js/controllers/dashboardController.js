angular.module('bankMoreApp')
    .controller('DashboardController', ['$scope', 'AuthService', 'AccountService', function($scope, AuthService, AccountService) {
        
        $scope.user = null;
        $scope.balance = null;
        $scope.loading = true;
        $scope.error = '';

        $scope.formatCurrency = AccountService.formatCurrency;
        $scope.formatAccountNumber = AccountService.formatAccountNumber;

        function loadUserData() {
            $scope.loading = true;
            $scope.error = '';

            AuthService.getCurrentUser()
                .then(function(user) {
                    $scope.user = user;
                    return AccountService.getBalance();
                })
                .then(function(response) {
                    $scope.balance = response.data;
                    $scope.loading = false;
                })
                .catch(function(error) {
                    $scope.loading = false;
                    $scope.error = 'Erro ao carregar dados da conta.';
                    console.error('Error loading user data:', error);
                });
        }

        $scope.refreshBalance = function() {
            loadUserData();
        };

        $scope.getBalanceClass = function() {
            if (!$scope.balance) return '';
            return $scope.balance.balance >= 0 ? 'text-success' : 'text-danger';
        };

        $scope.getBalanceIcon = function() {
            if (!$scope.balance) return 'bi-wallet2';
            return $scope.balance.balance >= 0 ? 'bi-wallet2' : 'bi-exclamation-triangle';
        };

        loadUserData();
    }]);
