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

                // Add other custom components here.

                // Adds a function that checks if a step/interaction is complete and requires category if true
                categoryRequired: function (selectedStatus, currentPlanType) {
                    if (selectedStatus === apiContactReportOptions.getCompletedStatusCode(currentPlanType)) {
                        return true;
                    }
                    return false;
                },

                // Returns the custom portfolio datalist ID
                myPortfolioDatalistId: function () {
                    return 'f5dbcd14-181b-44bc-9062-e4bfdcf458bc'; // Custom Portfolio Frogger Data List
                },

                // Adds a function that uses the custom datalist spec to build the custom name (first name, last name, class of)
                getProspectName: function (frogResources, prospectValues) {
                    return prospectUtilities.getFullNameWithClassOf(frogResources, prospectValues[2], prospectValues[1], prospectValues[5]);
                }

            };
        }]);

}());