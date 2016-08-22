Hoo.define("Hoo.Application",{
	statics:{
	   __factory : {},
	   __currentController : null,
	   __config  : {
		   basePath     : '',
		   defaultRoute : 'index',
		   selector     : 'div[data-role="page"]',
		   route        : {}, 
		   onHashChange : function(route){
			   
		   }
	   },
	   getBasePath : function(){
		   return this.__config.basePath;
	   },
	   /**
	    * @example
	    * 	var cfg = {
	    *       route : {
	    *          'hashname'  : '控制器路径'
	    *          //'hashname': { controller: '','rely':[],type:'',params:{},action:'',title:'标题'}
	    *       }
	    *   };
	    * @param {Object} cfg
	    * 
	    */
	   init : function(cfg){
		   var me = this,controller,hashchange = function(){
			   var routeName,hash = location.hash,params = Hoo.util.Url.unformat(hash);
			   var formatParams = {};
			   if(params && params.params){
				   try{
				       formatParams = JSON.parse(params.params);
				   }catch(e){}
			   }
			   
			   var loadController = function(routeName,callback){
				    if(me.__config.route[routeName]){
				    	var controllerName = me.__config.route[routeName],rely = [];
				    	if(Hoo.util.Object.isObject(controllerName)){
				    		var _rely      = controllerName['rely'] || [];
				    		controllerName = controllerName['controller'];
				    		Hoo.util.Array.each(_rely,function(ele){ 
				    			rely.push(me.__config.basePath + Hoo.util.String.replaceAll(ele,'\\.','\/')); 
				    		});
				    	}
				    	Hoo.util.Ajax.require(rely,function(){
					    	var name = Hoo.util.String.replaceAll(controllerName,'\\.','\/'); // 点分割 {!!} 路径/子路径/文件名
					    	Hoo.util.Ajax.require(me.__config.basePath + name,function(){
					    		var controller = Hoo.create(controllerName,{});
					    		callback(controller);
					    	});
				    	});
					}
			   }
			   if(hash == ''){
				  routeName = me.__config.defaultRoute;
			   }else{ 
				  routeName = hash.replace('#','').split('?')[0];
			   }
			   //TODO 20160819 需要先加载首页后,执行引用?跳转.
			   if(!me.__factory[routeName]){
				  
				  if(!me.__factory[me.__config.defaultRoute]){  //如果主界面没加载,则先加载主界面
					   loadController(me.__config.defaultRoute,function(dfController){
						   me.__currentController = dfController;
						   
						   me.__factory[me.__config.defaultRoute] = dfController;
						   
						   if(routeName !=  me.__config.defaultRoute){
							   loadController(routeName,function(controller){
								   if(me.__currentController != null && controller != null){ 
									   me.__currentController.hide(); 
								   }
								   if(controller != null){
									    controller.fireEvent('beforeshow',controller,formatParams);
									    controller.show();
									    controller.fireEvent('show',controller,formatParams);
								  		me.__currentController = controller;
								  		me.__factory[routeName] = controller;
								  		me.__currentController.setTitle(me.__currentController.getTitle());
								   }
							   });
							   
						   }else{
							   dfController.fireEvent('beforeshow',dfController,formatParams);
							   dfController.show();
							   dfController.fireEvent('show',dfController,formatParams);
							   me.__currentController.setTitle(me.__currentController.getTitle());
						   }
					   });
				   }else if(routeName !=  me.__config.defaultRoute){
					   //如果路由合法
					   loadController(routeName,function(controller){
						   if(me.__currentController != null && controller != null){ 
							   me.__currentController.hide(); 
							}
						   if(controller != null){
							   controller.fireEvent('beforeshow',controller,formatParams);
							   controller.show();
							   controller.fireEvent('show',controller,formatParams);
						  	   me.__currentController = controller;
						  	   me.__factory[routeName] = controller;
						   }
						   me.__currentController.setTitle(me.__currentController.getTitle());
					   });
				   }
			   }else{
				   controller = me.__factory[routeName];
				   //控制器 控制显示
				   if(me.__currentController != null && controller != null){ 
					   me.__currentController.fireEvent('beforehide');
					   me.__currentController.hide(); 
					}
				   if(controller != null){
					    controller.fireEvent('beforeshow',controller,formatParams);
					    controller.show();
					    controller.fireEvent('show',controller,formatParams);
				  		me.__currentController = controller;
				   }
				   
				   //获取参数 title 如果没有则 默认title
				   me.__currentController.setTitle(me.__currentController.getTitle());
			   }
			   
			   me.__config.onHashChange.call(me,routeName);
		   };
		   Hoo.copyTo(cfg || {},this.__config);
		    
			//设置加载路径
			//设置请求路径
			//设置模块化入口
			//设置默认主界面(所有Page的加载,必须先加载完主界面)
			//路由 /控制器 映射关系?
			
			//1、判断路径是否是默认主界面,不是则先加载主界面，之后加载 对应界面
			$(window).hashchange(hashchange);
			if(location.hash == ''){ location.hash = '#' + me.__config.defaultRoute; }else{
				hashchange();
			}
			
	   },
	   //错误时跳转界面(相对路径),如果null/空 则默认主界面
	   onError  : 'html/404.html',
	   switchTo : function(router,params){
		   //控制应用界面的前进
		   if(params){
			   location.hash = '#'+ router + '?params=' + JSON.stringify(params);
		   }else{
			   location.hash = '#'+ router;
		   }
	   },
	   back     : function(){//用于控制应用界面的返回
		   if(document.referrer === '' && window.history.length <= 2){
			   this.switchTo(''); return;
		   }
		   window.history.back();
		   //如果back前 没有历史记录,同时hash不是index,则选择替换路径 到首页！！！
	   }
	}
});