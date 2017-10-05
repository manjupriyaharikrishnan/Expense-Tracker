	/*** populate the Category of expense  ***/
ExpenseTracker.factory('ExpenseCategory', function ($http) {
	
	return {
		category: function(callback) {
            $http.get('app/js/models/category.json').success(callback);
        }
	};
});

	/*** Date releated function  ***/
ExpenseTracker.factory('DateFactory', function () {
	
	return {
		getTodayDate:function(){
				var d=new Date();
	    		var month=(d.getMonth()+1<10)?"0"+(d.getMonth()+1):(d.getMonth()+1);
	    		var date=(d.getDate()<10)?"0"+(d.getDate()):(d.getDate());
	    		return   month + "/" + date +"/"+d.getFullYear();	
		},

		getPatternDate:function(date,month,year){
			var patterndate="";

			if(month==undefined || month==='') 
				patterndate="[0-9]{2}"+"\/"+"[0-9]{2}"+"\/"+year;
			else if(date==undefined || date==='') 
				patterndate=month+"\/"+"[0-9]{2}"+"\/"+year; 
			else 
				patterndate=month+"\/"+date+"\/"+year; 

			return new RegExp(patterndate);
		},

		formatDate:function(date,month,year){
				var Fomatedate="";
				var monthNames = [ "January", "February","March", "April", "May", "June", "July","August","September","October", "November","December"];

			if(month==undefined || month==='') 
				Fomatedate=year;
			else if(date==undefined || date==='') 
				Fomatedate=monthNames[month-1]+ "-" +year; 
			else 
				Fomatedate=date+"-"+ monthNames[month-1] +"-" +year; 
			
			return Fomatedate;
		}
	};

});

			/*** Expense related operation ***/
ExpenseTracker.factory('ExpenseFactory', function () {
	
	return {
			/*** to check whether expense already exist ***/
		exist:function(SearchObject,key){
			var check=-1;
			
			for(var i in SearchObject) {		
				var keylist=Object.keys(SearchObject[i]);
					if(SearchObject[i][keylist[0]]===key)
					{
						 check=i;
						 break;
					}
			}

			return check;
		},
			/*** to populate the expense on add expense view ***/
		populate:function(SearchObject,object){
			var keylist=Object.keys(object);
			var pos=this.exist(SearchObject,object[keylist[0]]);
			(pos==-1)?SearchObject.push(object):SearchObject[pos][keylist[1]]=object[keylist[1]]; 
			return SearchObject; 
		},
			/*** Retrieve the expenses of specified date ***/
		RetriveDateExpense:function(date){
			
			if(localStorage.ExpenseTrackerData!==undefined) { 
				var expenseTrackerData=[];
				expenseTrackerData=JSON.parse(localStorage.ExpenseTrackerData);
				var pos=this.exist(expenseTrackerData,date);
				return (pos!==-1)?expenseTrackerData[pos]["expense"]:[];
				
			} else return [];
		},
			/*** GET the acculumative Expense list ***/
		getExpenseData:function(datalist,expense){
		
			for(var i in expense) {
					var pos=this.exist(datalist,expense[i].item);
					(pos===-1)?datalist.push(expense[i]):datalist[pos]["cost"]+=expense[i]["cost"];
				
			}

			return datalist;
		}
	};

});
ExpenseTracker.factory('ModalWindow', function ($modal,$interval) {
		var modalInstance;
		return{
			createModal:function(message,callback){
				modalInstance = $modal.open({
			        templateUrl: 'app/partials/Directives/ModalWindowTPL.html',
			        controller: modalWindowCtrl,
			        resolve: {
			          	message: function () {
			            	return message;
			          	}
			        }
		 		});
		 		this.getModalValue(callback);
			},
			getModalValue:function(callback){
			 	modalInstance.result.then(function (status) {
     					return callback(status);
     			});
     		
			}
		};
});
