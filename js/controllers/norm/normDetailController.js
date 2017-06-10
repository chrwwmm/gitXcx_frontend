angular.module('MetronicApp').controller('normDetailController', function($rootScope, $scope, req,uploadFile,$state,$stateParams,$q) {
	$scope.$on('$viewContentLoaded', function() {
		// initialize core components
		App.initAjax();
		console.log($stateParams.id);
		function init() {//初始化
			var normid = $stateParams.id;
			console.log(normid);
			req('GET', 'norm/id/'+normid, {}, function(res) {
				// 请求成功执行代码
				if(res.code==0){
					let list = res.result;
					console.log(list);
					$scope.typeList = list;
					console.log($scope.typeList);
					var cont=$scope.typeList.content;
					console.log(cont);
					var idcont=document.getElementById('cont');
					idcont.innerHTML=cont;
				}else{
					alert(res.msg);
					console.log(res.result);
				}
			});
		};
		init();
	});
});