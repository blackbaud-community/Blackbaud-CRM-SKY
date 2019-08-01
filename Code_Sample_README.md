# blackbaud-crm-sky
A repository containing the code needed to extend Blackbaud CRM's Fundraiser on the Go SKY-based mobile app.

## Code Samples

Follow these instructions to extend Blackbaud SKY-based mobile apps.

### Adding logic to an existing form

When completing a step/interaction, the out of the box version does not have any custom logic. If you require a category when completing a step, you can customize frogger to do the same. Here are the steps:

1. Determine what is needed to complete the functionality. For the category, we need to know the completed status code (function in apiContactReportOptions) and the current status of the step/interaction (already defined in `contactreport.js`). Since these already exist, we can use them to build our custom function.
2. Edit `custom.js` to add the new function to make `category` required. Note that `apiContactReportOptions` needs to be injected in the factory to support this function :
    ```javascript
    // Add other custom components here.
                    // Adding a function that checks if a step/interaction is complete, then category is required
                    categoryRequired: function (selectedStatus, currentPlanType) {
                        if (selectedStatus === apiContactReportOptions.getCompletedStatusCode(currentPlanType)) {
                            return true;
                        }
                        return false;
                    }
    ```
3. Edit `customizable.js` to add the new function, which will return false as out of the box functionality:
    ```javascript
        // Add other custom components here.
        categoryRequired: function () {
                            return false;
                        }
    ```
4. Next, add the function to the javascript controller:
    1. Inject `customizable` into the ContactReportController and function (`views\contactreport.js`)
    2. Add the function:
        ```javascript
        // Adding custom function to check if category is required based on step/interaction status.
		        function isCategoryRequired() {
		            return customizable.CategoryRequired(locals.selectedStatus, currentPlanType);
		        }
        ```
    3. Add to the locals scope under the initialize function:
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
			                isCategoryRequired: isCategoryRequired
			            };
        ```
5. Add the new class to the html by finding where category is in the `contactreport.html` file. Then add the `ng-class` to the label:
    Before:
    ```html
            <div class="form-group">
                                    <label class="control-label" for="category">{{frogResources.category}}</label>
    ```
    After:
    ```html
            <div class="form-group">
                                    <label class="control-label" for="category"
                                        ng-class="{'required' : locals.isCategoryRequired() }">{{frogResources.category}}</label>
    ```
    Also, under select, add the `ng-required` attribute:
    ```html
            <select ng-model="locals.selectedCategory" name="category"
                                            ng-required="locals.isCategoryRequired()"
                                            ng-options="category.id as category.name for category in locals.categories"
                                            class="form-control">
                                        <option value="" selected></option>
                                    </select>
    ```
6. Open an administrator command prompt from the `Blackbaud.AppFx.MajorGiving.Mobile.Sky` folder and run:
    
    `grunt buildcustom`

7. Access installation by navigating to: &#60;application root&#62;/browser/htmlforms/custom/frogger&databaseName=&#60;yourdatabasename&#62;