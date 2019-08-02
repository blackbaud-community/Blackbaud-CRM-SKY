# blackbaud-crm-sky
A repository containing code samples illustrating how to extend Blackbaud CRM's Fundraiser on the Go SKY-based mobile app.

## Table of contents
- [Code samples](#code-samples)
    + [Adding logic to an existing form](#adding-logic-to-an-existing-form)

## Code samples

We've prepared a code sample that modifies the basic components of Fundraiser on the Go. Check back for additions and enhancements!

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
