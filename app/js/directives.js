'use strict';

/* Directives */


angular.module('myApp.directives', []).
    directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }])
    .directive('numberOnlyInput', function () {
        return {
            restrict: 'EA',
            template: '<input name="{{inputName}}" ng-model="inputValue" />',
            scope: {
                inputValue: '=',
                inputName: '='
            },
            link: function (scope) {
                scope.$watch('inputValue', function (newValue, oldValue) {
                    var arr = String(newValue).split("");
                    if (arr.length === 0) return;
                    if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.' )) return;
                    if (arr.length === 2 && newValue === '-.') return;
                    if (isNaN(newValue)) {
                        scope.inputValue = oldValue;
                    }
                });
            }
        };
    })
    .directive('checkForm', function (servicesFactory) {
        return {
            restrict: 'E',
            templateUrl: 'partials/checkFormTemplate.html',
            scope: false,
            link: function (scope) {
                scope.checkAvailability = function () {
                    console.log('checking...');
                }


                // function used while user is typing.
                // if other city was selected clean fields: street, number
                scope.cleanSelection = function () {
                    scope.selectedFilter.street = '';
                    scope.selectedFilter.number = '';
                    scope.result.cityTickVisible = true;
                    scope.services = '';

                    //sprawdzic czy aktualnie wybrana miejscowosc ma w ogole ulice czy tylko numery.
                    for (var i = 0; i < scope.database.all.length; i++) {
                        if (scope.database.all[i].city.name === scope.selectedFilter.city) {
                            var cityItem = scope.database.all[i].city;
                            console.log(cityItem);
                        }
                    }
                }

                // check availability function is called when user fills 3 inputs in the form.
                scope.checkAvailability = function (selectedFilter) {


                    // go through the cities and select matched city
                    for (var i = 0; i < scope.database.all.length; i++) {

                        // if selected city equals city in the database
                        if (scope.database.all[i].city.name === scope.selectedFilter.city) {

                            // we have city that matches!
                            var cityItem = scope.database.all[i].city;
                            console.log('our CITY match in the DB = ' + cityItem.name);

                            // go through the streets associated with given city and select matched
                            for (var j = 0; j < cityItem.street.length; j++) {

                                if (cityItem.street[j].name == "*") {
                                    scope.services = scope.translateServices(cityItem.street[j].services);
                                    scope.result.available = true;
                                    break;
                                }

                                // if selected street equals street in the database
                                else if (cityItem.street[j].name === scope.selectedFilter.street) {

                                    // we have street that matches!
                                    var streetItem = cityItem.street[j];
                                    console.log('our STREET match in the DB = ' + streetItem.name);


                                    // go through numbrs associated with given city and street
                                    var streetNumbersArray = streetItem.number;


                                    // exception is that if numbers array contains * wildcard we just return available = true
                                    // this means that all numbers on given street are available
                                    // check if number contains wildcard - "*"

                                    if (streetNumbersArray.indexOf("*") != -1) {

                                        scope.result.available = true;
                                        scope.services = streetItem.services;
                                        console.log(scope.services);

                                    }

                                    // if number does not contain wildcard - do regular search
                                    else {
                                        if (DEBUG) {
                                            console.log('aktualne numery = ' + streetNumbersArray);
                                            console.log('szukany number = ' + scope.selectedFilter.number);
                                        }

                                        // number has been found in the numbers array --> return true and get available services;
                                        var isIn = streetNumbersArray.indexOf(scope.selectedFilter.number);
                                        if (isIn >= 0) {
                                            scope.result.available = true;
                                            scope.services = scope.translateServices(cityItem.street[j].services);
                                            break;
                                        }
                                        else {
                                            scope.result.available = false;
                                        }
                                    }
                                }
                            }
                            break;
                        }
                        scope.result.available = false;
                    }

                }


                // function returns string service names instead of ids
                // it uses servicesFactory to do the translation
                scope.translateServices = function (servicesArray) {
                    var servicesDb = servicesFactory.get();

                    var outputArray = [];
                    for (var i = 0; i < servicesArray.length; i++) {
                        outputArray.push(servicesDb[servicesArray[i]]);
                    }
                    console.log(outputArray);
                    return outputArray;
                }


            }
        }
    });



