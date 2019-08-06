/// <reference path="../../bower_components/angular/angular.js" />

/*global angular */

/* This file, meant to be used in tandem with crm.customizable.js, names customizable components within Fundraiser on the Go.
 * Here, specify the desired behavior of properties/functions as you want them to behave in your custom application.
 * The alternate version of the same property/function must appear in crm.customizable.js.
 */
(function () {
    'use strict';

    angular.module("frog.api")
        .factory('customizable', ['apiContactReportOptions', 'prospectUtilities', function (apiContactReportOptions, prospectUtilities) {
            return {

                /**
                 * Gets the name of the application's root folder. Corresponds to customizableRoot.getRootFolder.
                 * @returns {String}
                 * Do not remove this function.
                 */
                getRootFolder: function () {
                    return 'frogger';
                },

                /**
                 * Gets a value indicating whether or not this is a custom application. Corresponds to customizableRoot.isCustomApp.
                 * @returns {Boolean}
                 * Do not remove this function.
                 */
                isCustomApp: function () {
                    return true;
                },

                /**
                 * Gets a value indicating whether or not category is required.
                 * @param {int} selectedStatus The status of the step or interaction.
                 * @param {int} currentPlanType The plan type.
                 */
                categoryRequired: function (selectedStatus, currentPlanType) {
                    if (selectedStatus === apiContactReportOptions.getCompletedStatusCode(currentPlanType)) {
                        return true;
                    }
                    return false;
                },

                /**
                 * Returns the ID of the Data List to be used to fetch prospects in the fundraiser's portfolio.
                 */
                myPortfolioDatalistId: function () {
                    return 'f5dbcd14-181b-44bc-9062-e4bfdcf458bc'; // Custom Portfolio Frogger Data List
                },

                /**
                 * Returns the full formatted name of the given prospect, with information on graduating class.
                 * @param {any} frogResources
                 * @param {String} firstName The first name of the prospect.
                 * @param {String} lastName The last name of the prosect.
                 * @param {String} classOf The prospect's graduating year.
                 */
                getProspectName: function (frogResources, firstName, lastName, classOf) {
                    return prospectUtilities.getFullNameWithClassOf(frogResources, firstName, lastName, classOf);
                }

            };
        }]);

}());