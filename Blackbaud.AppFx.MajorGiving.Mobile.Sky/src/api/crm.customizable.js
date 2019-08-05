/// <reference path="../../bower_components/angular/angular.js" />

/*global angular */

/* This file, meant to be used in tandem with crm.custom.js, names customizable components within Fundraiser on the Go.
 * Here, specify the desired behavior of properties/functions as you want them to behave in the out of box FROG.
 * The alternate version of the same property/function must appear in crm.custom.js.
 */
(function () {
    'use strict';

    angular.module("frog.api")
        .factory('customizableRoot', ['prospectUtilities', function (prospectUtilities) {
            return {

                /**
                 * Gets the name of the application's root folder.
                 * 
                 * Do not remove this function.
                 */
                getRootFolder: function () {
                    return 'frog';
                },

                /**
                 * Gets a value indicating whether or not this is a custom application.
                 * 
                 * Do not remove this function.
                 */
                isCustomApp: function () {
                    return false;
                },

                // Add other custom components here.

                categoryRequired: function () {
                    return false;
                },

                myPortfolioDatalistId: function () {
                    return 'da329c8b-773c-4501-8329-77047018f6a9'; //  FundraiserPortfolio.Mobile.DataList.xml
                },

                getProspectName: function (frogResources, prospectValues) {
                    return prospectUtilities.getFullName(frogResources, prospectValues[2], prospectValues[1]);
                }

            };
        }]);

}());