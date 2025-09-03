angular.module('bankMoreApp')
    .service('TransferService', ['$http', 'AuthService', 'API_CONFIG', function($http, AuthService, API_CONFIG) {
        
        this.createTransfer = function(transferData) {
            return $http.post(API_CONFIG.TRANSFER_API + '/Transfer', transferData, {
                headers: AuthService.getAuthHeaders()
            });
        };

        this.generateRequestId = function() {
            return 'REQ_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        };

        this.validateTransferData = function(transferData) {
            var errors = [];

            if (!transferData.destinationAccountNumber) {
                errors.push('Número da conta de destino é obrigatório');
            }

            if (!transferData.amount || transferData.amount <= 0) {
                errors.push('Valor deve ser maior que zero');
            }

            if (transferData.amount && transferData.amount > 10000) {
                errors.push('Valor máximo para transferência é R$ 10.000,00');
            }

            return errors;
        };

        this.formatTransferAmount = function(amount) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(amount);
        };
    }]);
