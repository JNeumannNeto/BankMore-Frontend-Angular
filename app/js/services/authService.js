angular.module('bankMoreApp')
    .service('AuthService', ['$http', '$q', '$location', 'API_CONFIG', function($http, $q, $location, API_CONFIG) {
        var self = this;
        var currentUser = null;
        var token = localStorage.getItem('bankmore_token');

        this.login = function(credentials) {
            var deferred = $q.defer();
            
            $http.post(API_CONFIG.ACCOUNT_API + '/Account/login', credentials)
                .then(function(response) {
                    token = response.data.token;
                    localStorage.setItem('bankmore_token', token);
                    
                    self.getCurrentUser().then(function(user) {
                        currentUser = user;
                        deferred.resolve(response.data);
                    });
                })
                .catch(function(error) {
                    deferred.reject(error);
                });
                
            return deferred.promise;
        };

        this.register = function(userData) {
            return $http.post(API_CONFIG.ACCOUNT_API + '/Account/register', userData);
        };

        this.logout = function() {
            token = null;
            currentUser = null;
            localStorage.removeItem('bankmore_token');
            $location.path('/');
        };

        this.isAuthenticated = function() {
            return !!token;
        };

        this.getToken = function() {
            return token;
        };

        this.getCurrentUser = function() {
            var deferred = $q.defer();
            
            if (currentUser) {
                deferred.resolve(currentUser);
            } else if (token) {
                $http.get(API_CONFIG.ACCOUNT_API + '/Account/balance', {
                    headers: { 'Authorization': 'Bearer ' + token }
                })
                .then(function(response) {
                    currentUser = {
                        accountNumber: response.data.accountNumber,
                        balance: response.data.balance
                    };
                    deferred.resolve(currentUser);
                })
                .catch(function(error) {
                    self.logout();
                    deferred.reject(error);
                });
            } else {
                deferred.reject('No token available');
            }
            
            return deferred.promise;
        };

        this.requireAuth = function() {
            var deferred = $q.defer();
            
            if (this.isAuthenticated()) {
                deferred.resolve();
            } else {
                deferred.reject('AUTH_REQUIRED');
            }
            
            return deferred.promise;
        };

        this.getAuthHeaders = function() {
            return {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            };
        };

        if (token) {
            this.getCurrentUser();
        }
    }]);
