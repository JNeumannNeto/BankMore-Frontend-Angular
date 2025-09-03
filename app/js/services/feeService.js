angular.module('bankMoreApp')
    .service('FeeService', ['$http', 'AuthService', 'API_CONFIG', function($http, AuthService, API_CONFIG) {
        
        this.getFeesByAccount = function(accountNumber) {
            return $http.get(API_CONFIG.FEE_API + '/Fee/' + accountNumber);
        };

        this.getFeeById = function(feeId) {
            return $http.get(API_CONFIG.FEE_API + '/Fee/fee/' + feeId);
        };

        this.formatFeeAmount = function(amount) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(amount);
        };

        this.formatFeeDate = function(dateString) {
            if (!dateString) return '';
            
            var date = new Date(dateString);
            return new Intl.DateTimeFormat('pt-BR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        };

        this.getFeeTypeDescription = function(feeType) {
            var descriptions = {
                'TRANSFER': 'Taxa de Transferência',
                'MAINTENANCE': 'Taxa de Manutenção',
                'WITHDRAWAL': 'Taxa de Saque',
                'DEPOSIT': 'Taxa de Depósito',
                'OTHER': 'Outras Taxas'
            };
            
            return descriptions[feeType] || feeType;
        };

        this.calculateTotalFees = function(fees) {
            if (!fees || !Array.isArray(fees)) return 0;
            
            return fees.reduce(function(total, fee) {
                return total + (fee.amount || 0);
            }, 0);
        };
    }]);
