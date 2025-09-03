angular.module('bankMoreApp')
    .controller('LoginController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {
        
        $scope.loginData = {
            accountNumber: '',
            cpf: '',
            password: ''
        };

        $scope.loading = false;
        $scope.error = '';
        $scope.loginType = 'account';

        $scope.setLoginType = function(type) {
            $scope.loginType = type;
            $scope.error = '';
            
            if (type === 'account') {
                $scope.loginData.cpf = '';
            } else {
                $scope.loginData.accountNumber = '';
            }
        };

        $scope.login = function() {
            if (!$scope.loginForm.$valid) {
                $scope.error = 'Por favor, preencha todos os campos obrigatórios.';
                return;
            }

            $scope.loading = true;
            $scope.error = '';

            var credentials = {
                password: $scope.loginData.password
            };

            if ($scope.loginType === 'account') {
                credentials.accountNumber = $scope.loginData.accountNumber;
            } else {
                credentials.cpf = $scope.loginData.cpf;
            }

            AuthService.login(credentials)
                .then(function(response) {
                    $location.path('/dashboard');
                })
                .catch(function(error) {
                    $scope.loading = false;
                    
                    if (error.status === 401) {
                        $scope.error = 'Credenciais inválidas. Verifique seus dados e tente novamente.';
                    } else if (error.status === 400) {
                        $scope.error = error.data.message || 'Dados inválidos.';
                    } else {
                        $scope.error = 'Erro interno do servidor. Tente novamente mais tarde.';
                    }
                });
        };

        $scope.formatCpf = function() {
            if ($scope.loginData.cpf) {
                var cpf = $scope.loginData.cpf.replace(/\D/g, '');
                if (cpf.length <= 11) {
                    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
                    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
                    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                    $scope.loginData.cpf = cpf;
                }
            }
        };

        $scope.clearMessages = function() {
            $scope.error = '';
        };

        if (AuthService.isAuthenticated()) {
            $location.path('/dashboard');
        }
    }]);
