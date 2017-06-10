angular.module('MetronicApp').controller('areaController', function($rootScope, $scope, req,$state) {
	$scope.$on('$viewContentLoaded', function() {
		// initialize core components
		App.initAjax();
		$scope.modal = {
			currentId: 0,
			currentVal: '' //当前名称值
		}
		$scope.addType = function(data) {
			$scope.modal.id = !data?0:data._id;
			$scope.modal.currentVal = !data?null:data.name;
		};
		
		function refresh(){//刷新当前页面
			$('#myModal').modal('hide');
			setTimeout(function (){
				$state.go('area',{},{reload:true});
			}, 1000)
		}
		
		$scope.saveType = function() {
			let val = $scope.modal.currentVal;
			let id = $scope.modal.id;
			console.log(id);
			if(!val) {
				return;
			}
			if(id){
				let a = {
					name: val,
					id:id
				};
				req('POST', 'area/modify', a, function(res) {
					//请求成功执行代码
					if(res.code==0){
						alert(res.msg);
						refresh();
					}else{
						alert(res.msg);
						console.log(res.result);
					}
				}, function(res) {
					// 请求失败执行代码
				});
			}else{
				let a = {
					name: val
				};
				req('POST', 'area/save', a, function(res) {
					// 请求成功执行代码
					if(res.code==0){
						alert(res.msg);
						refresh();
					}else{
						alert(res.msg);
						console.log(res.result);
					}
				});
			}
		};
		
		$scope.delType = function(data) {
			let id = data._id;
			console.log(id);
			if(!id) {
				return;
			}
			
			let a = {
				id:id
			};
			req('POST', 'area/del', a, function(res) {
				// 请求成功执行代码
				if(res.code==0){
					alert(res.msg);
					$state.go('area',{},{reload:true});
				}else{
					alert(res.msg);
					console.log(res.result);
				}
			});
		};
		init();

		function init() { //初始化
			req('GET', 'area/type/all', {}, function(res) {
				// 请求成功执行代码
				if(res.code==0){
					let list = res.result;
					$scope.typeList = list;
					//$state.go('theme',{},{reload:true});
				}else{
					alert(res.msg);
					console.log(res.result);
				}
			}, function(res) {
				// 请求失败执行代码
			});
		}

	});
});