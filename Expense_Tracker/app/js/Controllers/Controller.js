/********* AddExpense Controller ends here  *********/
ExpenseTracker.controller('addExpenseCtrl', function ($scope,$interval,ModalWindow,$location,ExpenseCategory,DateFactory,ExpenseFactory) {
	
	$scope.expenses; 															// expense data for the particular day
	$scope.edited;

	/*** intialize the add expense controller ***/
	$scope.init=function(){
			
			$scope.date=DateFactory.getTodayDate(); 								// set the today date
			$scope.expenses=ExpenseFactory.RetriveDateExpense($scope.date);			// retrieve the expenses of current date
		   	$("#datepicker").datepicker();
		   	
	}
	/*** invoke the category FACTORY method  ***/
	ExpenseCategory.category(function(data)  {
		
			$scope.categories=data.TravelCategory; 									// list of categories for expense details

	});

	/*** Set the Whether expense has been edited or not ***/
	$scope.$watch('expenses',function(oldVal,newVal){
		$scope.edited=(oldVal===newVal)?false:true;
	},true);


	/***  Backup of the previous date  ***/
	$scope.$watch('date',function(newVal,oldVal){
		$scope.previousDate=oldVal;
	},true);


	/*** Set the today for Today button ***/
	$scope.getTodayDate=function() {
	   	$scope.date=DateFactory.getTodayDate(); 									// set the today date
		
	}

	/*** on Date change Retrieve the expense ***/
	$scope.onchangeDate=function(){
	
		if($scope.edited===true && $scope.expenses.length>0) {
			
			ModalWindow.createModal("The changes made to the expense will be losed, are you sure wanna conntinue",function(confirm){ 
				if(confirm===true){	
					$scope.expenses=ExpenseFactory.RetriveDateExpense($scope.date);
					$scope.edited=false;
				}
				else
					$scope.date=$scope.previousDate;
			});
		} 
		else {
			$scope.expenses=ExpenseFactory.RetriveDateExpense($scope.date);
			$scope.edited=false;
		}
	}	

	/*** to GET the basic expense and its respective cost ***/
	$scope.basicExpensepopulate=function(){
		
		if($scope.basicExpense!==undefined && $scope.basicExpense!=='' && $scope.basicExpenseCost!==undefined && $scope.basicExpenseCost!==''){
			var expense={};
			expense.item=$scope.basicExpense;
			expense.cost=parseFloat($scope.basicExpenseCost);
			$scope.expenses=ExpenseFactory.populate($scope.expenses,expense);
			$scope.basicExpenseCost="";
		}

	}

	/*** to GET the other expense and its respective cost ***/
	$scope.otherExpensepopulate=function(){

		if($scope.otherExpense!==undefined && $scope.otherExpense!=='' && $scope.otherExpenseCost!==undefined && $scope.otherExpenseCost!=='' ){
				var expense={};
				expense.item=$scope.otherExpense.toLowerCase();
				expense.cost=parseFloat($scope.otherExpenseCost);
				$scope.expenses=ExpenseFactory.populate($scope.expenses,expense);
				$scope.otherExpenseCost="";
		}

	}	
	
	/*** to Edit and Commit the current Expense from the list ***/
	$scope.editedExpense=function(expense) {

			if(! new RegExp(/^[+]?\d+(\.\d+)?$/).test($scope.expenses[this.$index].cost))
				$scope.expenses[this.$index].cost=$scope.previousExpense;

	}

	/*** to Rollback the changed expense from the list ***/
	$scope.cancelExpense=function(expense){
		$scope.expenses[this.$index].cost=$scope.previousExpense;
	}

	/*** to Delete the Expense from the list ***/
	$scope.deleteExpense=function(expense) {
		
		$scope.expenses.splice(this.$index,1)	
	}
	
	/***  Backup of the previous Expense **/
	$scope.oldExpense=function(expense){
 			$scope.previousExpense=$scope.expenses[this.$index].cost;
 	}

 	/*** Save The Entire Expense list ***/
	$scope.saveExpense=function() {
			
		// custom confirm modal window
     	ModalWindow.createModal("are you sure wanna save",function(confirm){

			if($scope.date!==undefined && confirm===true) {

				var dateExpense={};
				dateExpense.date=$scope.date;
				dateExpense.expense=$scope.expenses;
				
				var expenseTrackerData=[];
				(localStorage.ExpenseTrackerData===undefined)? expenseTrackerData.push(dateExpense):
						expenseTrackerData=ExpenseFactory.populate(JSON.parse(localStorage.ExpenseTrackerData),dateExpense);

				localStorage.ExpenseTrackerData=JSON.stringify(expenseTrackerData);
				$location.path('/home');
			}

		});
		
	}
});
	/********* AddExpense Controller ends here  *********/

	/********* View Expense Controller starts here  *********/
ExpenseTracker.controller('viewExpenseCtrl', function ($scope,$location,DateFactory,ExpenseFactory) {

	/*** INtialize year value and populate  ***/
	$scope.init=function() {
		var year=[];
			for(var i=parseInt(new Date().getFullYear());i>1947;i--)
				year.push(i);

		$scope.yearOption=year;
		
	}

	/**** populate the month value  ***/
	$scope.getMonth=function(){
			var month=[];
			if($scope.year!==undefined)
			{
				for(var i=1;i<13;i++)
					(i<10)?month.push("0"+i):month.push(i);

				$scope.monthOption=month;
				
			}
			
	}

	/**** populate the date value  ***/
	$scope.getDate=function() {
		
		var date=[];
		if($scope.year !==undefined && $scope.month!==undefined)
		{
			for(var i=1;i<=new Date($scope.year,$scope.month,0).getDate();i++)
				(i<10)?date.push("0"+i):date.push(i);
			$scope.dateOption=date;
		} 
	}
	
	/*** Find the Expense for the particular Date ***/
	$scope.findExpense=function() {
			var expensedata=(localStorage.ExpenseTrackerData===undefined)?[]:JSON.parse(localStorage.ExpenseTrackerData);
			var datalist=[];
			$scope.datakey=[];
			var Datepattern=DateFactory.getPatternDate($scope.date,$scope.month,$scope.year);

			for(var i in expensedata) 
				if(Datepattern.test(expensedata[i].date)) 
					datalist=ExpenseFactory.getExpenseData(datalist,expensedata[i].expense)


			$scope.expenses=datalist;
			$scope.dateFormat=DateFactory.formatDate($scope.date,$scope.month,$scope.year);
	}

	/*** Switch to the stastic page ***/
	$scope.viewStats=function(){
		localStorage.expensedata=JSON.stringify($scope.expenses);
		localStorage.dateOfExpense=JSON.stringify($scope.dateFormat);
		$location.path('/statistic');
	}

});
	/********* View Expense Controller ends here  *********/

	/********* stats Controller starts here  *********/
ExpenseTracker.controller('statsCtrl', function ($scope,$location) {
 	
 	$scope.init=function(){
 		var w = 400, h = 400, r = 200;  

	$scope.date=JSON.parse(localStorage.dateOfExpense)
  	data=JSON.parse(localStorage.expensedata);
  	
  	color=["#DC143C","#6495ED","#D2691E","#8A2BE2","#ACC52F","#FF4500","#808000","#8B4513","#00FA9A","#7FFF00"], i=10;
	
	
    while(i<data.length)
    {
        var c="#"+((1<<24)*Math.random()|0).toString(16);
        if(color.indexOf(c)===-1)
        {
            color[i]=c;
            i++;
        }
    }

    var vis = d3.select("#first")
        .append("svg:svg")  
        .attr("id","chart")
        .attr("width", w)
        .attr("height", h)  
        .attr("viewBox","0 100 500 150")   
        .attr("perserveAspectRatio","xMinYMid")          
        .data([data])                  
       .append("svg:g")  
       .attr("transform", "translate(" + r + "," + r + ")") ;

  
    var arc = d3.svg.arc()              
        .outerRadius(100);

    var pie = d3.layout.pie()          
        .value(function(d) { return d.cost; });    

    var arcs = vis.selectAll("g.slice")     
        .data(pie)                          
        .enter()                           
        .append("svg:g")                
        .attr("class", "slice");    
        
        arcs.append("svg:path")
        .attr("fill", function(d, i) { return color[i]; } )   
        .attr("d", arc)        

	var legend = d3.select("#first").append("svg")
	    .attr("class", "legend")
	    .attr("width", 150)
	    .attr("height", 350)
	    .selectAll("g")
	    .data(data)
	    .enter().append("g")
	    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
	    .attr("width", 20)
	    .attr("height", 20)
	    .attr("x", 30)
	    .attr("stroke","black")
	    .attr("stroke-width","2px")
	    .attr("fill", function(d, i) { return color[i]; } )
	    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("text")
	    .attr("transform", function(d, i) { return "translate(60," + ((i * 20) +10)+ ")"; })
	    .attr("dy", ".35em")
	    .text(function(d,i) {
	        return data[i].item;
	           });

	 	}
 	
});
	/********* stats Controller ends here  *********/
var modalWindowCtrl= function ($scope,$modalInstance,message) {	
	$scope.message=message;
	  
	  $scope.ok = function () {
	    $modalInstance.close(true);
	  };

	  $scope.cancel = function () {
	  	 $modalInstance.close(false);
	  };


};