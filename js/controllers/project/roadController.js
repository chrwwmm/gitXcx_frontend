angular.module('MetronicApp').controller('roadController', function($rootScope, $scope, req, uploadFile, $state, $q) {
	$scope.$on('$viewContentLoaded', function() {
		// initialize core components
		App.initAjax();
		$scope.modal = {
			currentId: '0',
			currentPid: '0',
			currentVal: '', //当前名称值
			currentImg: '', //图片地址
			areaid: ''
		}
		$scope.addType = function(data) {
			//$scope.modal.currentPid = !(data && data.pid[0])?'0':data.pid[0]._id;
			var pid = !data ? '' : data.pid;
			$scope.modal.currentVal = !data ? null : data.name;
			$scope.modal.currentId = !data ? null : data._id;
			$scope.modal.currentImg = !data ? null : data.img;

			setTimeout(function() {
				$scope.$apply(function() {
					$scope.modal.areaid = pid;
				});
				ComponentsSelect2.init();
				ComponentsBootstrapSelect.init();
			}, 200);

		};
		$scope.saveType = function() {
			let val = $scope.modal.currentVal;
			let id = $scope.modal.currentId;
			//let pid = $scope.modal.currentPid;
			let img = $scope.modal.currentImg;
			if(!val) {
				alert("标题不能为空");
				return;
			}
			let pid = $scope.modal.areaid;
			console.log(pid);
			if(!pid) {
				alert("辖区不能为空");
				return;
			}
			if(id) {
				let a = {
					name: val,
					id: id,
					img: img,
					pid: pid
				};
				
				req('POST', 'road/modify', a, function(res) {
					//请求成功执行代码
					if(res.code == 0) {
						alert(res.msg);
						refresh();
					} else {
						alert(res.msg);
						console.log(res.result);
					}
				}, function(res) {
					// 请求失败执行代码
				});
			} else {
				let a = {
					name: val,
					img: img,
					pid: pid
				};
				console.log(a);
				req('POST', 'road/save', a, function(res) {
					// 请求成功执行代码
					if(res.code == 0) {
						alert(res.msg);
						refresh();
					} else {
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
				id: id
			};
			req('POST', 'road/del', a, function(res) {
				// 请求成功执行代码
				if(res.code == 0) {
					alert(res.msg);
					refresh();
				} else {
					alert(res.msg);
					console.log(res.result);
				}
			});
		};
		init();

		function init() { //初始化
			var defer = $q.defer();
			var promise = defer.promise;
			req('GET', 'road/type/all', {}, function(res) {
				// 请求成功执行代码
				if(res.code == 0) {
					let list = res.result;
					$scope.typeList = list;
					defer.resolve(list);
				} else {
					alert(res.msg);
					console.log(res.result);

				}
			});

			promise
				.then(function(value) {
					console.log("in promise1 ---- success");
					console.log(value);
					req('GET', 'area/type/all', {}, function(res) {
						// 请求成功执行代码
						if(res.code == 0) {
							let list = res.result;
							$scope.pList = list;
						} else {
							alert(res.msg);
							console.log(res.result);
						}
					});
				});
		}

		$scope.delPid = function(id, pid) {
			if(!id || !pid) {
				return;
			}

			let a = {
				id: id,
				pid: pid
			};
			req('POST', 'road/delArea', a, function(res) {
				// 请求成功执行代码
				if(res.code == 0) {
					alert(res.msg);
					refresh();
				} else {
					alert(res.msg);
					console.log(res.result);
				}
			});
		}

		function refresh() { //刷新当前页面
			$('#myModal').modal('hide');
			setTimeout(function() {
				$state.go('road', {}, {
					reload: true
				});
			}, 1000)
		}
		$('#file_upload').change(function(e) {
			var event = e || window.event;
			var target = event.target || event.srcElement;
			if(e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
			var files = target.files || event.dataTransfer.files;
			uploadFile('road/upload', files).then(function(res) {
				if(res && res.data.result) {
					$scope.modal.currentImg = res.data.result;
				} else {
					alert('修改失败');
				}
			});
		});

	});
});