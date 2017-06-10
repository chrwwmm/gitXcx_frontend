angular.module('MetronicApp').controller('unitDetailController', function($rootScope, $scope, req,uploadFile,$state,$stateParams,$q) {
	$scope.$on('$viewContentLoaded', function() {
		// initialize core components
		App.initAjax();
		console.log($stateParams.id);
		function init() {//初始化
			var defer = $q.defer();
		 	var promise = defer.promise;
			var unitid = $stateParams.id;
			console.log(unitid);
			req('GET', 'unit/id/'+unitid, {}, function(res) {
				// 请求成功执行代码
				if(res.code==0){
					let list = res.result;
					console.log(list);
					$scope.typeList = list;
					console.log($scope.typeList);
					defer.resolve(list);
				}else{
					alert(res.msg);
					console.log(res.result);
				}
			});
			promise
			.then(function(value){
		 		console.log(value);
		 		req('GET', 'area/type/all', {}, function(res) {
					// 请求成功执行代码
					if(res.code==0){
						let list = res.result;
						$scope.pList = list;
						console.log($scope.pList);
					}else{
						alert(res.msg);
						console.log(res.result);
					}
				});
		 	});
		};
		init();
	});
});