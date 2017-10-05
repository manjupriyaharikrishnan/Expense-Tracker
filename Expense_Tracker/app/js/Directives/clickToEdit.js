ExpenseTracker.directive('editableText', function () {
	return {
		restrict: 'E',
		replace:true,
		templateUrl:'app/partials/Directives/ClickToEdit.html',
		scope:{
			data:'=',
			button:"=",
			save:"&",
			cancel:"&",
			deletedata:"&",
			backup:"&"
		}		

	};
});
