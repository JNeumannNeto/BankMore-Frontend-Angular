angular.module('bankMoreApp')
    .service('AccountService', ['$http', 'AuthService', 'API_CONFIG', function($http, AuthService, API_CONFIG) {
        
        this.getBalance = function() {
            return $http.get(API_CONFIG.ACCOUNT_API + '/Account/balance', {
                headers: AuthService.getAuthHeaders()
            });
        };

        this.getBalanceByAccountNumber = function(accountNumber) {
            return $http.get(API_CONFIG.ACCOUNT_API + '/Account/balance/' + accountNumber);
        };

        this.accountExists = function(accountNumber) {
            return $http.get(API_CONFIG.ACCOUNT_API + '/Account/exists/' + accountNumber);
        };

        this.createMovement = function(movementData) {
            return $http.post(API_CONFIG.ACCOUNT_API + '/Account/movement', movementData, {
                headers: AuthService.getAuthHeaders()
            });
        };

        this.deactivateAccount = function(password) {
            return $http.put(API_CONFIG.ACCOUNT_API + '/Account/deactivate', { password: password }, {
                headers: AuthService.getAuthHeaders()
            });
        };

        this.formatCurrency = function(value) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value);
        };

        this.formatAccountNumber = function(accountNumber) {
            if (!accountNumber) return '';
            var str = accountNumber.toString();
            return str.replace(/(\d{4})(\d{4})(\d{2})/, '$1.$2-$3');
        };
    }]);
