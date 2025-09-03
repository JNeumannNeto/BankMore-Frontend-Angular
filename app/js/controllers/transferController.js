angular.module('bankMoreApp')
    .controller('TransferController', ['$scope', 'TransferService', 'AccountService', 'AuthService', function($scope, TransferService, AccountService, AuthService) {
        
        $scope.transferData = {
            destinationAccountNumber: '',
            amount: '',
            description: ''
        };

        $scope.loading = false;
        $scope.error = '';
        $scope.success = '';
        $scope.currentBalance = null;
        $scope.destinationAccountValid = null;
        $scope.checkingAccount = false;

        $scope.formatCurrency = TransferService.formatTransferAmount;

        function loadCurrentBalance() {
            AccountService.getBalance()
                .then(function(response) {
                    $scope.currentBalance = response.data;
                })
                .catch(function(error) {
                    console.error('Error loading balance:', error);
                });
        }

        $scope.checkDestinationAccount = function() {
            if (!$scope.transferData.destinationAccountNumber || $scope.transferData.destinationAccountNumber.length < 10) {
                $scope.destinationAccountValid = null;
                return;
            }

            $scope.checkingAccount = true;
            
            AccountService.accountExists($scope.transferData.destinationAccountNumber)
                .then(function(response) {
                    $scope.destinationAccountValid = response.data;
                    $scope.checkingAccount = false;
                })
                .catch(function(error) {
                    $scope.destinationAccountValid = false;
                    $scope.checkingAccount = false;
                });
        };

        $scope.transfer = function() {
            if (!$scope.transferForm.$valid) {
                $scope.error = 'Por favor, preencha todos os campos obrigatórios.';
                return;
            }

            var errors = TransferService.validateTransferData($scope.transferData);
            if (errors.length > 0) {
                $scope.error = errors.join(', ');
                return;
            }

            if (!$scope.destinationAccountValid) {
                $scope.error = 'Conta de destino não encontrada.';
                return;
            }

            if ($scope.currentBalance && parseFloat($scope.transferData.amount) > $scope.currentBalance.balance) {
                $scope.error = 'Saldo insuficiente para realizar a transferência.';
                return;
            }

            $scope.loading = true;
            $scope.error = '';
            $scope.success = '';

            var transferRequest = {
                requestId: TransferService.generateRequestId(),
                destinationAccountNumber: $scope.transferData.destinationAccountNumber,
                amount: parseFloat($scope.transferData.amount),
                description: $scope.transferData.description || ''
            };

            TransferService.createTransfer(transferRequest)
                .then(function(response) {
                    $scope.loading = false;
                    $scope.success = 'Transferência realizada com sucesso!';
                    
                    $scope.transferData = {
                        destinationAccountNumber: '',
                        amount: '',
                        description: ''
                    };
                    
                    $scope.destinationAccountValid = null;
                    $scope.transferForm.$setPristine();
                    $scope.transferForm.$setUntouched();
                    
                    loadCurrentBalance();
                })
                .catch(function(error) {
                    $scope.loading = false;
                    
                    if (error.status === 400 && error.data && error.data.message) {
                        $scope.error = error.data.message;
                    } else if (error.status === 401) {
                        $scope.error = 'Sessão expirada. Faça login novamente.';
                        AuthService.logout();
                    } else {
                        $scope.error = 'Erro ao realizar transferência. Tente novamente.';
                    }
                });
        };

        $scope.formatAmount = function() {
            if ($scope.transferData.amount) {
                var value = parseFloat($scope.transferData.amount);
                if (!isNaN(value)) {
                    $scope.transferData.amount = value.toFixed(2);
                }
            }
        };

        $scope.clearMessages = function() {
            $scope.error = '';
            $scope.success = '';
        };

        loadCurrentBalance();
    }]);
