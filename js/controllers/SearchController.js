/* Setup search page controller */
angular.module('MetronicApp').controller('SearchController', function($rootScope, $scope, req,uploadFile,$state,$q) {
    $scope.$on('$viewContentLoaded', function() {   
        App.initAjax();
        $scope.model = {
			currentValue:''
		}
	    $scope.search = function() {//执行搜索
			let val = $scope.model.currentValue;
			console.log(val);
			if (!val) {
				alert('内容不能为空');
		      	return;
		   };
			req('GET', 'norm/search', { value: val },function(res) {
				if(res.code==0){
					let list = res.result;
					console.log(list);
					$scope.sList = list;
				}else{
					alert(res.msg);
					console.log(res.result);
				}
			});
		}
    });
});
