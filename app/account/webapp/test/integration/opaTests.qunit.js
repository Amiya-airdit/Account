sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/airdit/agpp/accounts/account/test/integration/FirstJourney',
		'com/airdit/agpp/accounts/account/test/integration/pages/departmentsList',
		'com/airdit/agpp/accounts/account/test/integration/pages/departmentsObjectPage'
    ],
    function(JourneyRunner, opaJourney, departmentsList, departmentsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/airdit/agpp/accounts/account') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThedepartmentsList: departmentsList,
					onThedepartmentsObjectPage: departmentsObjectPage
                }
            },
            opaJourney.run
        );
    }
);