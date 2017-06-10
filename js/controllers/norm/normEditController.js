angular.module('MetronicApp').controller('normEditController', function($rootScope, $scope, req, uploadFile, $state, $q,$stateParams) {
	$scope.$on('$viewContentLoaded', function() {
		// initialize core components
		App.initAjax();

		var editNorm = $stateParams.editNorm;
		var sts = false; //编辑状态默认是新增

		$scope.modal = {
			currentId: editNorm&&editNorm._id ? editNorm._id : '0',
			currentVal: editNorm&&editNorm.title ? editNorm.title : '', //当前名称值
			currentNumber: editNorm&&editNorm.number ? editNorm.number : '',
			industryList: [],
			themeList: []
		};
		var list1=[],list2=[];
		if(editNorm&&editNorm.themeIds && editNorm.themeIds.length>0){
			for(var i=0;i<editNorm.themeIds.length;i++){
				list1.push(editNorm.themeIds[i]._id);
			}
		}
		$scope.modal.themeList = list1;
		if(editNorm&&editNorm.industryIds && editNorm.industryIds.length>0){
			for(var i=0;i<editNorm.industryIds.length;i++){
				list2.push(editNorm.industryIds[i]._id);
			}
		}
		$scope.modal.industryList=list2;
		var ue = UE.getEditor('editor');
		ue.addListener("ready", function() {
			if(editNorm && editNorm.content) {
				ue.execCommand('insertHtml', editNorm.content);
				sts = true; //编辑状态为修改
			}
		});

		$scope.$on('$destroy', function() {//https://segmentfault.com/q/1010000003924221
			ue.destroy();
		});

		init();

		function init() { //初始化
			req('GET', 'theme/type/all', {}, function(res) {
				// 请求成功执行代码
				if(res.code == 0) {
					let list = res.result;
					$scope.themeList = list;
				} else {
					alert(res.msg);
					console.log(res.result);
				}
			});

			req('GET', 'industry/type/all', {}, function(res) {
				// 请求成功执行代码
				if(res.code == 0) {
					let list = res.result;
					$scope.industryList = list;
				} else {
					alert(res.msg);
					console.log(res.result);
				}
			});
		}

		$scope.save = function() {
			let title = $("#title").val();
			let number = $("#number").val();
			let themeList = $("#select2_sample1").val();
			let industryList = $("#select2_sample2").val();
			let id = $scope.modal.currentId;
			let content = UE.getEditor('editor').getContent();
			if(!title) {
				alert("标题不能为空");
				return;
			}
			if(!content) {
				alert("内容不能为空");
				return;
			}
			if(!themeList) {
				themeList = [];
			}
			if(!industryList) {
				industryList = [];
			}
			let save = {
				title: title,
				number: number,
				themeList: themeList,
				industryList: industryList,
				content: content
			}
			if(!sts) {
				req('POST', 'norm/save', save, function(res) {
					// 请求成功执行代码
					if(res.code == 0) {
						alert(res.msg);
						$state.go('norm',{},{reload:true});
					} else {
						alert(res.msg);
						console.log(res.result);
					}
				});
			} else {
				save.id = id;
				req('POST', 'norm/modify', save, function(res) {
					// 请求成功执行代码
					
					if(res.code == 0) {
						alert(res.msg);
						$state.go('norm',{},{reload:true});
					} else {
						alert(res.msg);
						console.log(res.result);
					}
				});
			}
		}

	});
});