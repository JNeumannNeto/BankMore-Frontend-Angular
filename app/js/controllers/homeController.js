angular.module('bankMoreApp')
    .controller('HomeController', ['$scope', 'AuthService', function($scope, AuthService) {
        
        $scope.isAuthenticated = function() {
            return AuthService.isAuthenticated();
        };

        $scope.features = [
            {
                icon: 'bi-shield-check',
                title: 'Segurança',
                description: 'Suas transações protegidas com a mais alta tecnologia de segurança bancária.'
            },
            {
                icon: 'bi-lightning-charge',
                title: 'Rapidez',
                description: 'Transferências instantâneas 24 horas por dia, 7 dias por semana.'
            },
            {
                icon: 'bi-graph-up',
                title: 'Controle',
                description: 'Acompanhe seu saldo e movimentações em tempo real.'
            },
            {
                icon: 'bi-headset',
                title: 'Suporte',
                description: 'Atendimento especializado sempre que você precisar.'
            }
        ];
    }]);
