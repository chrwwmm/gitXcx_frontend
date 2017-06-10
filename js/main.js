/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
	"ui.router",
	"ui.bootstrap",
	"oc.lazyLoad",
	"ngSanitize"
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
	$ocLazyLoadProvider.config({
		// global configs go here
	});
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
	// this option might be handy for migrating old apps, but please don't use it
	// in new ones!
	$controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
	// supported languages
	var settings = {
		layout: {
			pageSidebarClosed: false, // sidebar menu state
			pageContentWhite: true, // set page content layout
			pageBodySolid: false, // solid body color state
			pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
		},
		assetsPath: '../assets',
		globalPath: './assets/global',
		layoutPath: './assets/layouts/layout',
		//url: 'https://chy.tunnel.qydev.com/',
		main_url: 'http://139.199.226.13:3000/'
	};

	$rootScope.settings = settings;

	return settings;
}]);

MetronicApp.factory('req', ['$http', 'settings', function($http, settings) {
	var req = function(method, uri, data, successCallback, errorCallback) {
		var reqData = {
			method: method,
			url: settings.main_url + uri
		}
		if(reqData.method=="GET"){
			reqData.params = data;
		}else{
			reqData.data = data;
		}
		$http(reqData).then(function(response) {
			// 请求成功执行代码
			if(!response || !response.data) {
				return;
			}
			if(successCallback)
			successCallback.call(null, response.data);
		}, function(response) {
			// 请求失败执行代码
			if(!response) {
				return;
			}
			if(errorCallback)
			errorCallback.call(null, response.data);
		});
	}

	return req;
}]);

MetronicApp.factory('uploadFile', ['$http', 'settings', function($http, settings) {
	function uploadFile(url,files) {
		return $http({
			method: 'POST',
			url: settings.main_url + url || '',
			headers: {
				'Content-Type': undefined
			},
			transformRequest: function() {
				var formData = new FormData();
				angular.forEach(files, function(value, key) {
					formData.append(key, value);
				});
				return formData;
			}
		});
	}
	return uploadFile;
}]);
/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
	$scope.$on('$viewContentLoaded', function() {
		//App.initComponents(); // init core components
		//Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
	});
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function($scope) {
	$scope.$on('$includeContentLoaded', function() {
		Layout.initHeader(); // init header
	});
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$state', '$scope', function($state, $scope) {
	$scope.$on('$includeContentLoaded', function() {
		Layout.initSidebar($state); // init sidebar
	});
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
	$scope.$on('$includeContentLoaded', function() {
		Layout.initFooter(); // init footer
	});
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	// Redirect any unmatched url
	$urlRouterProvider.otherwise("/dashboard.html");

	$stateProvider

		.state('theme', {
			url: "/theme",
			templateUrl: "views/norm/theme.html",
			data: {
				pageTitle: '规范类别'
			},
			controller: "themeController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before',
						files: [
							'js/controllers/norm/themeController.js',
						]
					});
				}]
			}
		})
		.state('industry', {
			url: "/industry",
			templateUrl: "views/norm/industry.html",
			data: {
				pageTitle: '行业类别'
			},
			controller: "industryController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before',
						files: [
							'./assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            './assets/global/plugins/select2/css/select2.min.css',
                            './assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            './assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            './assets/global/plugins/select2/js/select2.full.min.js',

                            './assets/pages/scripts/components-bootstrap-select.min.js',
                            './assets/pages/scripts/components-select2.min.js',
                            
							'js/controllers/norm/industryController.js',
						]
					});
				}]
			}
		})
		.state('norm', {
			url: "/norm",
			templateUrl: "views/norm/norm.html",
			data: {
				pageTitle: '规范'
			},
			controller: "normController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before',
						files: [
							'js/controllers/norm/normController.js',
							
						]
					});
				}]
			}
		})
		.state('normDetail', {
			url: "/normDetail?id",
			templateUrl: "views/norm/normDetail.html",
			data: {
				pageTitle: '规范详情'
			},
			controller: "normDetailController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before',
						files: [
							'js/controllers/norm/normDetailController.js',
							
						]
					});
				}]
			}
		})
		.state('normEdit', {
			url: "/normEdit",
			templateUrl: "views/norm/normEdit.html",
			data: {
				pageTitle: '编辑规范'
			},
			params: {'editNorm': null},
			controller: "normEditController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before',
						files: [
							'./assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            './assets/global/plugins/select2/css/select2.min.css',
                            './assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            './assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            './assets/global/plugins/select2/js/select2.full.min.js',

                            './assets/pages/scripts/components-bootstrap-select.min.js',
                            './assets/pages/scripts/components-select2.min.js',
                            
							'js/controllers/norm/normEditController.js',
							
						]
					});
				}]
			}
		})
		
		.state('area', {
			url: "/area",
			templateUrl: "views/project/area.html",
			data: {
				pageTitle: '地区项目'
			},
			controller: "areaController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before',
						files: [
							'js/controllers/project/areaController.js',
						]
					});
				}]
			}
		})
		.state('road', {
			url: "/road",
			templateUrl: "views/project/road.html",
			data: {
				pageTitle: '区域项目'
			},
			controller: "roadController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before',
						files: [
							'./assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            './assets/global/plugins/select2/css/select2.min.css',
                            './assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            './assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            './assets/global/plugins/select2/js/select2.full.min.js',

                            './assets/pages/scripts/components-bootstrap-select.min.js',
                            './assets/pages/scripts/components-select2.min.js',
                            
							'js/controllers/project/roadController.js',
						]
					});
				}]
			}
		})
		.state('unit', {
			url: "/unit",
			templateUrl: "views/project/unit.html",
			data: {
				pageTitle: '项目'
			},
			controller: "unitController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before',
						files: [
							'js/controllers/project/unitController.js',
							
						]
					});
				}]
			}
		})
		.state('unitDetail', {
			url: "/unitDetail?id",
			templateUrl: "views/project/unitDetail.html",
			data: {
				pageTitle: '项目详情'
			},
			controller: "unitDetailController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before',
						files: [
							'js/controllers/project/unitDetailController.js',
							
						]
					});
				}]
			}
		})
		.state('unitEdit', {
			url: "/unitEdit",
			templateUrl: "views/project/unitEdit.html",
			data: {
				pageTitle: '项目编辑'
			},
			params: {'editUnit': null},
			controller: "unitEditController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before',
						files: [
							'./assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            './assets/global/plugins/select2/css/select2.min.css',
                            './assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            './assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            './assets/global/plugins/select2/js/select2.full.min.js',

                            './assets/pages/scripts/components-bootstrap-select.min.js',
                            './assets/pages/scripts/components-select2.min.js',
                            
							'js/controllers/project/unitEditController.js',
							
						]
					});
				}]
			}
		})
		
		// Dashboard
		.state('dashboard', {
			url: "/dashboard.html",
			templateUrl: "views/dashboard.html",
			data: {
				pageTitle: '规范'
			},
			controller: "DashboardController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
						files: [
							'js/controllers/DashboardController.js',
						]
					});
				}]
			}
		})

		// Blank Page
		.state('blank', {
			url: "/blank",
			templateUrl: "views/blank.html",
			data: {
				pageTitle: 'Blank Page Template'
			},
			controller: "BlankController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
						files: [
							'js/controllers/BlankController.js'
						]
					});
				}]
			}
		})

		// Search Page
		.state('search', {
			url: "/search",
			templateUrl: "views/search.html",
			data: {
				pageTitle: 'Search Page Template'
			},
			controller: "SearchController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
						files: [
							'js/controllers/SearchController.js'
						]
					});
				}]
			}
		})
}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
	$rootScope.$state = $state; // state to be accessed from view
	$rootScope.$settings = settings; // state to be accessed from view
}]);