angular.module('bankMoreApp', ['ngRoute', 'ngAnimate'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'HomeController'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginController'
            })
            .when('/register', {
                templateUrl: 'views/register.html',
                controller: 'RegisterController'
            })
            .when('/dashboard', {
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardController',
                resolve: {
                    auth: ['AuthService', function(AuthService) {
                        return AuthService.requireAuth();
                    }]
                }
            })
            .when('/transfer', {
                templateUrl: 'views/transfer.html',
                controller: 'TransferController',
                resolve: {
                    auth: ['AuthService', function(AuthService) {
                        return AuthService.requireAuth();
                    }]
                }
            })
            .when('/fees', {
                templateUrl: 'views/fees.html',
                controller: 'FeeController',
                resolve: {
                    auth: ['AuthService', function(AuthService) {
                        return AuthService.requireAuth();
                    }]
                }
            })
            .when('/profile', {
                templateUrl: 'views/profile.html',
                controller: 'ProfileController',
                resolve: {
                    auth: ['AuthService', function(AuthService) {
                        return AuthService.requireAuth();
                    }]
                }
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.hashPrefix('!');
    }])
    .run(['$rootScope', '$location', 'AuthService', function($rootScope, $location, AuthService) {
        $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
            if (rejection === 'AUTH_REQUIRED') {
                $location.path('/login');
            }
        });

        $rootScope.$on('$routeChangeStart', function(event, next, current) {
            if (next.$$route && next.$$route.resolve && next.$$route.resolve.auth) {
                if (!AuthService.isAuthenticated()) {
                    event.preventDefault();
                    $location.path('/login');
                }
            }
        });
    }])
    .constant('API_CONFIG', {
        ACCOUNT_API: '/api',
        TRANSFER_API: '/api',
        FEE_API: '/api'
    });
