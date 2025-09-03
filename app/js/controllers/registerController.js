angular.module('bankMoreApp')
    .controller('RegisterController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {
        
        $scope.registerData = {
            name: '',
            cpf: '',
            password: '',
            confirmPassword: ''
        };

        $scope.loading = false;
        $scope.error = '';
        $scope.success = '';

        $scope.register = function() {
            if (!$scope.registerForm.$valid) {
                $scope.error = 'Por favor, preencha todos os campos obrigatórios.';
                return;
            }

            if ($scope.registerData.password !== $scope.registerData.confirmPassword) {
                $scope.error = 'As senhas não coincidem.';
                return;
            }

            if ($scope.registerData.password.length < 6) {
                $scope.error = 'A senha deve ter no mínimo 6 caracteres.';
                return;
            }

            $scope.loading = true;
            $scope.error = '';
            $scope.success = '';

            var userData = {
                name: $scope.registerData.name,
                cpf: $scope.registerData.cpf.replace(/\D/g, ''),
                password: $scope.registerData.password
            };

            AuthService.register(userData)
                .then(function(response) {
                    $scope.loading = false;
                    $scope.success = 'Conta criada com sucesso! Número da conta: ' + response.data.accountNumber;
                    
                    setTimeout(function() {
                        $location.path('/login');
                        $scope.$apply();
                    }, 3000);
                })
                .catch(function(error) {
                    $scope.loading = false;
                    
                    if (error.status === 400) {
                        $scope.error = error.data.message || 'Dados inválidos.';
                    } else if (error.status === 409) {
                        $scope.error = 'CPF já cadastrado no sistema.';
                    } else {
                        $scope.error = 'Erro interno do servidor. Tente novamente mais tarde.';
                    }
                });
        };

        $scope.formatCpf = function() {
            if ($scope.registerData.cpf) {
                var cpf = $scope.registerData.cpf.replace(/\D/g, '');
                if (cpf.length <= 11) {
                    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
                    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
                    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                    $scope.registerData.cpf = cpf;
                }
            }
        };

        $scope.validateCpf = function() {
            if ($scope.registerData.cpf) {
                var cpf = $scope.registerData.cpf.replace(/\D/g, '');
                
                if (cpf.length !== 11) {
                    $scope.registerForm.cpf.$setValidity('cpf', false);
                    return;
                }

                var sum = 0;
                var remainder;

                for (var i = 1; i <= 9; i++) {
                    sum = sum + parseInt(cpf.substring(i-1, i)) * (11 - i);
                }

                remainder = (sum * 10) % 11;

                if ((remainder === 10) || (remainder === 11)) {
                    remainder = 0;
                }

                if (remainder !== parseInt(cpf.substring(9, 10))) {
                    $scope.registerForm.cpf.$setValidity('cpf', false);
                    return;
                }

                sum = 0;
                for (var i = 1; i <= 10; i++) {
                    sum = sum + parseInt(cpf.substring(i-1, i)) * (12 - i);
                }

                remainder = (sum * 10) % 11;

                if ((remainder === 10) || (remainder === 11)) {
                    remainder = 0;
                }

                if (remainder !== parseInt(cpf.substring(10, 11))) {
                    $scope.registerForm.cpf.$setValidity('cpf', false);
                    return;
                }

                $scope.registerForm.cpf.$setValidity('cpf', true);
            }
        };

        if (AuthService.isAuthenticated()) {
            $location.path('/dashboard');
        }
    }]);
