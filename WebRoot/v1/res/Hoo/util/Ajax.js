/**
 * ajax 相关
 */
(function() {
	
	var loadedUrl = {},LoadLink,LoadLinkTpl,LoadAsyncLinkTpl,LoadJS = function(opts) {
		
			if(typeof opts == 'undefined'){ opts = {}; }
			var scr  = document.createElement("SCRIPT"), 
			    charset  = opts['charset'] || 'utf-8', 
			    callback = opts.callback   || function() {},
			    src      = opts.src;
			if(!Hoo.util.String.endWith(src,'.js')){ src += '.js';}   
			
			if(loadedUrl[src]){ callback(); return; }
			   loadedUrl[src] = true;
			
			scr.setAttribute('charset', charset);
			scr.setAttribute('type'   , 'text/javascript');
			scr.setAttribute('src'    , src);
			document.getElementsByTagName('head')[0].appendChild(scr);
			
			scr._scriptLoaded = 0;
			// IE和opera支持onreadystatechange safari、chrome、opera支持onload
			scr.onload = scr.onreadystatechange = function() {
				if (scr._scriptLoaded) { return; }; // 避免opera下的多次调用
				var readyState = scr.readyState;
				if ('undefined' == typeof readyState || readyState == "loaded" || readyState == "complete") {
					scr._scriptLoaded = 1;
					try {
						callback();
					} finally {
						scr.onload = scr.onreadystatechange = null;
						scr._scriptLoaded = 0;
						scr.parentNode.removeChild(scr);
					}
				}
			}
			
	};
	LoadLink = function(srcs,callback){
		if(srcs.length > 0){
			var src = srcs.shift();
			new LoadJS({
				src : src, callback : function(){ LoadLink(srcs,callback); }
			});
		}else{
			callback();
		}
	};
	LoadLinkTpl = function(srcs,callback,result){
		if(typeof result == 'undefined'){ result = [];}
		if(srcs.length > 0){
			var src = srcs.shift();
			if(!Hoo.util.String.endWith(src,'.tpl')){ src += '.tpl';}
			$.ajax( {
				type    : "get",
				url     : src  ,
				async   : false,
				dataType:'text',
				contentType: "application/json;charset=utf-8",
				success : function(response) {
					response = response.replace(/\<!--.+?--\>/g, '');
					result.push(response);
					LoadLinkTpl(srcs,callback,result);
					//callback.call(scope,response);
				}
			});
		}else{
			callback.apply(this,result);
		}
	};
	LoadAsyncLinkTpl = function(srcs,callback,result){
		if(typeof result == 'undefined'){ result = [];}
		if(srcs.length > 0){
			var src = srcs.shift();
			if(!Hoo.util.String.endWith(src,'.tpl')){ src += '.tpl';}
			$.ajax( {
				type    : "get",
				url     : src  ,
				success : function(response) {
					response = response.replace(/\<!--.+?--\>/g, '');
					result.push(response);
					LoadLinkTpl(srcs,callback,result);
					//callback.call(scope,response);
				}
			});
		}else{
			callback.apply(this,result);
		}
	};
	
	var LoadFile = function(uri,callback) {
		var xmlhttp;
		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		xmlhttp.onreadystatechange = function() {
			/*if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			}*/
			callback(xmlhttp.responseText);
		}
		xmlhttp.open("GET", uri, true);
		xmlhttp.send();
		
	}
	
	Hoo.define('Hoo.util.Ajax',{
		statics : {
			/**
			 * 只处理js
			 * @param {Object} srcs
			 * @param {Object} callback
			 */
			require : function(srcs,callback){
				if(Hoo.util.Object.isString(srcs)){ srcs = [srcs]; }
				if(Hoo.util.Object.isArray(srcs)){
					LoadLink(srcs,callback);
				}
			},
			asyncLoadTpl : function(){
				LoadAsyncLinkTpl(srcs,function(){
					callback.apply(scope||this,arguments);
				});
			},
			/**
			 * 同步方法,建议本地少量tpl
			 * @param {Object} srcs
			 * @param {Object} callback
			 * @param {Object} scope
			 */
			loadTpl : function(srcs,callback,scope){
				
				callback = callback || Hoo.emptyFn;
				if(Hoo.util.Object.isString(srcs)){ srcs = [srcs]; }
				
				
				/*LoadFile(src,function(response){ 
					response = response.replace(/\<!--.+?--\>/g, '');
					callback.call(scope,response);
				});*/
				//本地时可以使用本地读取方法 -- 类似于本地 post方法【思路可行,继续】
				
				LoadLinkTpl(srcs,function(){
					callback.apply(scope||this,arguments);
				});
				
				/*$.get(src).success(function(response){ 
					response = response.replace(/\<!--.+?--\>/g, '');
					callback.call(scope,response);
				});*/
				
				/*$('<div></div>').load(src,function(response){
					response = response.replace(/\<!--.+?--\>/g, '');
					callback.call(scope,response);
				});*/
			}
		}
	});
	
	
})();
