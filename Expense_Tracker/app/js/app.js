'use strict';

var ExpenseTracker=angular.module('expensetracker', ['ngRoute','ui.bootstrap']); // App name

/* Router path config */
ExpenseTracker.config(function($routeProvider) {
        
        $routeProvider.
         when('/home', {
            templateUrl: 'app/partials/home.html'
        }).
        when('/addexpense', {
         	templateUrl:'app/partials/addExpense.html',
         	controller: 'addExpenseCtrl'
         }).
         when('/viewexpense', {
            templateUrl:'app/partials/viewExpense.html',
            controller: 'viewExpenseCtrl'
         }).
         when('/statistic',{
            templateUrl:'app/partials/stats.html',
            controller: 'statsCtrl'
         }).
        otherwise({
            redirectTo: '/home'
        });
});
