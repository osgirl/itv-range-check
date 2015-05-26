'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('MyCtrl1', ['$scope', 'availabilityFactory', 'servicesFactory', function ($scope, availabilityFactory, servicesFactory) {


        //view model
        $scope.vm = {
            debugVisible: DEBUG,
            adminVisible: ADMIN,
        };

        $scope.database = {
            all: availabilityFactory.get(),
            cities: [],
            streets: [],
            numbers: {}
        };

        $scope.selectedFilter = {};


        // @TODO: house numbers can also contain letters.
        $scope.result = {
            available: false,
            cityTickVisible: true,
            streetTickVisible: false,
            numberTickVisible: false
        }
        $scope.available = false;
        $scope.cityTickVisible = true;
        $scope.streetTickVisible = false;
        $scope.numberTickVisible = false;



        // populate cities and streets lists
        for (var j = 0; j < $scope.database.all.length; j++) {
            var cityItem = $scope.database.all[j].city;

            $scope.database.cities.push(cityItem.name);


            if (cityItem.street != undefined) {
                $scope.database.streets[cityItem.name] = [];

                for (var i = 0; i < cityItem.street.length; i++) {
                    var streetName = cityItem.street[i].name;
                    $scope.database.streets[cityItem.name].push(streetName);
                }
            }
        }

        // set first element on the city input
        $scope.selectedFilter.city = $scope.database.cities[0];










        $scope.streetSelected = function () {
            $scope.result.streetTickVisible = true;
        }

        $scope.checkStreet = function (typed) {
            if (typed.length > 5) {
                $scope.streetTickVisible = true;
            }
            else {
                $scope.streetTickVisible = false;
            }
        }


    }]);
