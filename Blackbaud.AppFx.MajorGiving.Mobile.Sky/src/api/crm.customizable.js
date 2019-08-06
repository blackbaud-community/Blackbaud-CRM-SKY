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

                /**
                 * Gets a value indicating whether or not category is required.
                 */
                categoryRequired: function () {
                    return false;
                },

                /**
                 * Returns the ID of the Data List to be used to fetch prospects in the fundraiser's portfolio.
                 */
                myPortfolioDatalistId: function () {
                    return 'da329c8b-773c-4501-8329-77047018f6a9'; // FundraiserPortfolio.Mobile.DataList.xml
                },

                /**
                 * Returns the full formatted name of the given prospect, with information on graduating class.
                 * @param {any} frogResources
                 * @param {String} firstName The first name of the prospect.
                 * @param {String} lastName The last name of the prosect.
                 */
                getProspectName: function (frogResources, firstName, lastName) {
                    return prospectUtilities.getFullName(frogResources, firstName, lastName);
                }

            };
        }]);

}());