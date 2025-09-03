angular.module('bankMoreApp')
    .controller('FeeController', ['$scope', 'FeeService', 'AuthService', function($scope, FeeService, AuthService) {
        
        $scope.fees = [];
        $scope.loading = true;
        $scope.error = '';
        $scope.totalFees = 0;
        $scope.currentUser = null;

        $scope.formatFeeAmount = FeeService.formatFeeAmount;
        $scope.formatFeeDate = FeeService.formatFeeDate;
        $scope.getFeeTypeDescription = FeeService.getFeeTypeDescription;

        function loadFees() {
            $scope.loading = true;
            $scope.error = '';

            AuthService.getCurrentUser()
                .then(function(user) {
                    $scope.currentUser = user;
                    return FeeService.getFeesByAccount(user.accountNumber);
                })
                .then(function(response) {
                    $scope.fees = response.data || [];
                    $scope.totalFees = FeeService.calculateTotalFees($scope.fees);
                    $scope.loading = false;
                })
                .catch(function(error) {
                    $scope.loading = false;
                    
                    if (error.status === 404) {
                        $scope.fees = [];
                        $scope.totalFees = 0;
                    } else {
                        $scope.error = 'Erro ao carregar tarifas.';
                        console.error('Error loading fees:', error);
                    }
                });
        }

        $scope.refreshFees = function() {
            loadFees();
        };

        $scope.getFeeIcon = function(feeType) {
            var icons = {
                'TRANSFER': 'bi-arrow-left-right',
                'MAINTENANCE': 'bi-gear',
                'WITHDRAWAL': 'bi-cash-coin',
                'DEPOSIT': 'bi-plus-circle',
                'OTHER': 'bi-receipt'
            };
            
            return icons[feeType] || 'bi-receipt';
        };

        $scope.getFeeClass = function(feeType) {
            var classes = {
                'TRANSFER': 'border-primary',
                'MAINTENANCE': 'border-warning',
                'WITHDRAWAL': 'border-danger',
                'DEPOSIT': 'border-success',
                'OTHER': 'border-secondary'
            };
            
            return classes[feeType] || 'border-secondary';
        };

        $scope.getMonthlyFees = function() {
            if (!$scope.fees || $scope.fees.length === 0) return [];
            
            var currentMonth = new Date().getMonth();
            var currentYear = new Date().getFullYear();
            
            return $scope.fees.filter(function(fee) {
                var feeDate = new Date(fee.createdAt || fee.date);
                return feeDate.getMonth() === currentMonth && feeDate.getFullYear() === currentYear;
            });
        };

        $scope.getMonthlyTotal = function() {
            var monthlyFees = $scope.getMonthlyFees();
            return FeeService.calculateTotalFees(monthlyFees);
        };

        loadFees();
    }]);
