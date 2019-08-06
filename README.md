# blackbaud-crm-sky
A repository containing code samples illustrating how to extend Blackbaud CRM's Fundraiser on the Go SKY-based mobile app.

## Table of contents
- [Code samples](#code-samples)
    + [Using Infinity specs](#using-infinity-specs)
    + [Adding logic to an existing form](#adding-logic-to-an-existing-form)

## Code samples

We've prepared a code sample that modifies the basic components of Fundraiser on the Go. Check back for additions and enhancements!

### Using Infinity specs

It is possible to add Infinity specs that override the behavior found in Fundraiser on the Go. For example, you may need to modify a data list to better fit your organization's needs. In addition, your organization might want to add graduating class information to the portfolio listing, exclude stewardship plans, and change the criteria for "primary portfolio." This can be done by making the following changes:

1. First, we create the new custom `DataListSpec` in the `Blackbaud.CustomFx.Frog.Catalog` project. If you have not created custom specs before, please review Blackbaud's [SDK Guide](`https://www.blackbaud.com/files/support/guides/infinitydevguide/infsdk-developer-help.htm#infinityintroduction/cointroductiontocustomizations.htm`). 

For this code sample, we took our portfolio data list and made some subtle changes. See the `CustomPortfolio.DataList.xml` spec in the repository. To make the same modifications, you need to:

* Remove references to stewardship plans and stewardship plan steps
* Change the current portfolio to show the following:

    _Primary Portfolio_

    * Primary manager of a plan

    _Secondary Portfolio_

    * Prospect manager
    * Secondary manager of a plan
    * Owner, participant, or additional solicitor/fundraiser of a plan step or interaction

* Modify `DISTINCTPROSPECTS` to also pick up `CLASSOF` from the primary education
* Add the new `DISTINCTPROSPECTS.CLASSOF` field to the final select statement. Note to add this at the end because the existing code is dependent on the out-of-the-box columns being the same.
* Add the new `CLASSOF` field to the `OutputFields` section
    
Once the spec is finished, load the spec into the developer instance of CRM using `Loadspec`.

1. In the `Blackbaud.AppFx.MajorGiving.Mobile.Sky` solution, we need to override the current out-of-the-box datalist:

    The files `custom.js` and `customizable.js` are meant to contain functions that override existing Fundraiser on the Go behavior. The former contains the custom implementation and the latter preserves the out-of-box functionality.
    
    - Edit `custom.js` to first add a new function for `myPortfolioDatalistId` that returns the above custom datalist ID:

        ```javascript
        // Returns the custom portfolio datalist ID
        myPortfolioDatalistId: function () {
            return '06FE6231-198E-43BF-BD9A-4BD40CD19FD2'; // CustomPortfolio.DataList.xml
        }
        ```
        
    - Edit `customizable.js` to add the new function, which will return the out-of-the-box datalist ID as default:

        ```javascript
        myPortfolioDatalistId: function () {
            return 'da329c8b-773c-4501-8329-77047018f6a9'; //  FundraiserPortfolio.Mobile.DataList.xml
        }
        ```
1. Next, reference this custom ID by editing the API call wrapper. 

    The API wrapper that calls the portfolio data list is found in `crm.apiPortfolio.js`. We need to modify this to point to our new customizable function. Note that `customizable` needs to be injected in the factory and function to support it.

    ```javascript
    MYPORTFOLIO_DATALIST_ID = customizable.myPortfolioDatalistId();
    ```

1. To add the new class year to name, modify the name shown for the portfolio. Out-of-the-box functionality (`crm.apiPortfolio.js`) builds the full name using a function in `prospectUtilities` then formats it in the resources file (`resources_en_US.json`). We can use that existing pattern for our new custom name as well:

    Edit the resource file to add the new name format:

    ```json
    "name_format_class": {
      "_description": "The custom name format for a person. The {0} token is the name, then class of.",
      "message": "{0}, class of {1}"
    },
    ```

    Next, add the new function to `utils\frog\prospects.js` and reference the above format. Also, add the new function to the return at the bottom of the file:

    ```javascript
    function getFullNameWithClassOf(frogResources, firstName, keyName, classOf) {
        var result = getFullName(frogResources, firstName, keyName);

        if (classOf) {
            return frogResources.name_format_class.format(result, classOf);
        }

        return result;
    }
    ```
1. Now we can add our new function to our `custom` and `customizable` files:

    For out-of-the-box functionality, add the existing name format function to `customizable`. Note that `prospectUtilities` needs to be injected in the factory and function to support this:

    ```javascript
    getProspectName: function (frogResources, firstName, lastName) {
        return prospectUtilities.getFullName(frogResources, firstName, lastName);
    }
    ```

    Next, add the new function to `custom`, also noting that `prospectUtilities` needs to be injected:

    ```javascript
    getProspectName: function (frogResources, firstName, lastName, classOf) {
        return prospectUtilities.getFullNameWithClassOf(frogResources, firstName, lastName, classOf);
    }
    ```

1. Then we reference this new function in the api (`crm.apiPortfolio`). Note that `customizable` needs to be injected in the factory and function to support this new name format:

    ```javascript
    prospects.push({
        name: customizable.getProspectName(frogResources, prospectValues[2], prospectValues[1], prospectValues[5]),
        id: prospectValues[0].toUpperCase(),
        nextStepDate: prospectValues[3]
    });
    ```
    
1. The changes are complete! We've uploaded our custom spec, overridden the standard datalist in `custom.js`, added the default to `customizable.js`, updated the api, updated the necessary utilities and resources. To build, open an administrator command prompt from the `Blackbaud.AppFx.MajorGiving.Mobile.Sky` folder and run:
    
    `grunt buildcustom`

    Access your installation by navigating to: &#60;application root&#62;/browser/htmlforms/custom/frogger&databaseName=&#60;your database name&#62;

### Adding logic to an existing form

Out-of-the-box Fundraiser on the Go forms are subject to specific business rules. Sometimes, to fit your needs, you may need to override or modify these rules. For example, your organization might want to make Category a required field when completing a step or interaction. This can be done by making the following changes:

1. First, we override out-of-box functionality for the Category field. 

    The files `custom.js` and `customizable.js` are meant to contain functions that override existing Fundraiser on the Go behavior. The former contains the custom implementation and the latter preserves the out-of-box functionality.
    
    - Edit `custom.js` to add a new function to make `category` required. Note that `apiContactReportOptions` needs to be injected in the factory to support this function.

        ```javascript
        categoryRequired: function (selectedStatus, currentPlanType) {
            if (selectedStatus === apiContactReportOptions.getCompletedStatusCode(currentPlanType)) {
                return true;
            }
            return false;
        }
        ```
        
    - Edit `customizable.js` to add the new function, which will return `false` as default behavior:

        ```javascript
        categoryRequired: function () {
            return false;
        }
        ```

1. Next, we add this function call to the javascript controller, which dictates application behavior in the browser client.

    The form that allows users to add steps or interactions is the Contact Report form, found in `views\contactreport.js`. We'll need to modify this controller's behavior.

    - Add the following function and inject `customizable` into the controller to support it. This will allow the form to call the customized function we defined earlier.

        ```javascript
        function isCategoryRequired() {
            return customizable.CategoryRequired(locals.selectedStatus, currentPlanType);
        }
        ```
    
    - So that the function can be seen and referenced, we need to add it to the controller's initializer.

        ```javascript			
        function initialize() {
            $scope.frogResources = frogResources;
            $scope.locals = locals = {
                initialStepInfo: options.stepInfo,
                ItemTypeOption: ItemTypeOption,
                loadParticipants: loadParticipants,
                loadSolicitors: loadSolicitors,
                loadInteractions: loadInteractions,
                loadSteps: loadSteps,
                otherActions: otherActions,
                restoreDefaults: restoreDefaults,
                saveForm: saveForm,
                selectedActionOption: null,
                isCategoryRequired: isCategoryRequired // <- right here
            }
        };
        ```

1. Finally, we need to change the HTML for the Contact Report form (`views\contactreport.html`) to make the field required if the proper conditions are met.

    - Add code to conditionally make the field required.

        Before:

        ```html
        <label class="control-label"
               for="category">{{frogResources.category}}
        </label>
        ```

        After:

        ```html
        <label class="control-label"
               for="category"
               ng-class="{'required' : locals.isCategoryRequired() }">{{frogResources.category}}
        </label>
        ```

    - Finally, add the required attribute to the Category drop down.

        ```html
        <select ng-model="locals.selectedCategory"
                name="category"
                ng-required="locals.isCategoryRequired()"
                ng-options="category.id as category.name for category in locals.categories"
                class="form-control">
                <option value="" selected></option>
        </select>
        ```

1. The changes are complete! We've overridden the standard behavior in `custom.js`, added the default to `customizable.js`, updated the necessary javascript controllers, and modified the HTML to display the results to the user. To build, open an administrator command prompt from the `Blackbaud.AppFx.MajorGiving.Mobile.Sky` folder and run:
    
    `grunt buildcustom`

    Access your installation by navigating to: &#60;application root&#62;/browser/htmlforms/custom/frogger&databaseName=&#60;your database name&#62;