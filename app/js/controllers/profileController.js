angular.module('bankMoreApp')
    .controller('ProfileController', ['$scope', 'AuthService', 'AccountService', function($scope, AuthService, AccountService) {
        
        $scope.user = null;
        $scope.loading = true;
        $scope.error = '';
        $scope.success = '';
        $scope.showDeactivateForm = false;
        $scope.deactivatePassword = '';
        $scope.deactivating = false;

        $scope.formatAccountNumber = AccountService.formatAccountNumber;
        $scope.formatCurrency = AccountService.formatCurrency;

        function loadUserData() {
            $scope.loading = true;
            $scope.error = '';

            AuthService.getCurrentUser()
                .then(function(user) {
                    $scope.user = user;
                    $scope.loading = false;
                })
                .catch(function(error) {
                    $scope.loading = false;
                    $scope.error = 'Erro ao carregar dados do usuário.';
                    console.error('Error loading user data:', error);
                });
        }

        $scope.toggleDeactivateForm = function() {
            $scope.showDeactivateForm = !$scope.showDeactivateForm;
            $scope.deactivatePassword = '';
            $scope.error = '';
            $scope.success = '';
        };

        $scope.deactivateAccount = function() {
            if (!$scope.deactivatePassword) {
                $scope.error = 'Por favor, digite sua senha para confirmar.';
                return;
            }

            $scope.deactivating = true;
            $scope.error = '';
            $scope.success = '';

            AccountService.deactivateAccount($scope.deactivatePassword)
                .then(function(response) {
                    $scope.deactivating = false;
                    $scope.success = 'Conta desativada com sucesso. Você será redirecionado...';
                    
                    setTimeout(function() {
                        AuthService.logout();
                    }, 2000);
                })
                .catch(function(error) {
                    $scope.deactivating = false;
                    
                    if (error.status === 400) {
                        $scope.error = 'Senha incorreta.';
                    } else if (error.status === 401) {
                        $scope.error = 'Sessão expirada. Faça login novamente.';
                        AuthService.logout();
                    } else {
                        $scope.error = 'Erro ao desativar conta. Tente novamente.';
                    }
                });
        };

        $scope.cancelDeactivate = function() {
            $scope.showDeactivateForm = false;
            $scope.deactivatePassword = '';
            $scope.error = '';
            $scope.success = '';
        };

        loadUserData();
    }]);
