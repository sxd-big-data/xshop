/**
 * 纯web下的桥接接口实现
 * 默认 basePath 为 当前访问路径,如果是在WebRoot 子文件夹,则自行更正(initConfigrue)
 * @author hank
 */
(function(){
	
	Hoo.apply(Hoo.bridge.widget.dialog,{
		alert  : Hoo.plugs.Dialog.alert,
		confirm: Hoo.plugs.Dialog.confirm,
		toast  : Hoo.plugs.Dialog.toast
	});
	
	Hoo.apply(Hoo.bridge.net.http,{
		_post: function(cfgs){
			var	basePath = Hoo.bridge.getConfigrue()['basePath'];
			
			Hoo.$.ajax({
				type : 'POST',
				url : (cfgs.basePath == null ? basePath : cfgs.basePath) + cfgs.url,
				data : cfgs.params,
				success : function(result) {
					if (cfgs.format == 'fileupload') {
						cfgs.success.call(cfgs.scope || this, result);
						return;
					}
					if (result.status == 1) {
						cfgs.success.call(cfgs.scope || this, result);
					} else if(result.status == -9){
						//TODO web端,可以设置sessionStroage,之后在这里登录,成功则继续,失败则清空history后跳转首页?
						alert('登录失效,请重新登录.');
						var configure = Hoo.bridge.net.http.getConfigure();
						if(Hoo.util.Object.isObject(configure)){
							if(Hoo.util.Object.isFunction(configure.onSessionLost)){
								configure.onSessionLost.call(this,cfgs);
							}
						}
					} else {
						cfgs.fail.call(cfgs.scope || this, result.status,result.msg || result.message);
						if (cfgs.opts.showToast) { Hoo.bridge.widget.dialog.toast(result.msg || result.message); }
					}
				},
				error : function(err) {
					err = err || {};
					if (err.status == 404) {
						err.msg = '访问地址不存在(404).';
					}
					cfgs.fail.call(cfgs.scope || this, err.status,err.msg = (err.msg || '服务器异常.'));
					if (cfgs.opts.showToast) { Hoo.bridge.widget.dialog.toast(err.msg); }
				},
				dataType : 'json'
			});
		},
		post : function(opts){
			// method --> url, 相对好些
			var configure = this.getConfigure() || {};
			
			var cfgs = {
				opts     : configure.postOpts,
				basePath : null, url      : '', params   : {}, 
				success  : function(result){}, fail     : function(status,msg){}
			};
			Hoo.copyTo(opts,cfgs);
			
			this._post(cfgs);
		},
		upload : function(opts){
			var cfgs = {
				basePath : null,
				opts     : {},
				type     : 'file',
				url      : '',
				params   : {},
				success  : function(result){},
				fail     : function(status,msg){}
			};
			
			//上传 与 post 类似[暂不实现]
			
		}
	});
	
	Hoo.apply(Hoo.bridge.uri,{
		/**
		 * requestCode 场景下,web暂未实现通信,但会在backForResult中实现为:强制上一界面刷新
		 * 这里默认 地址 opts为字符串时  取值 absolutePath, 主要方便兼容 hybrid,参数取 basePath 即可
		 * @param {JSON | String} opts
		 */
		href : function(opts){
			if(Hoo.util.Object.isString(opts)){ opts = { absolutePath : opts }; }
			var cfgs = 	{ relative : false, params: {} },url = null;		
			Hoo.copyTo(opts,cfgs);
			// WEB 优先使用相对路径
			if(cfgs.relativePath){
				url = cfgs.relativePath + "?params=" + JSON.stringify(cfgs.params);
			}else if(cfgs.absolutePath){
				//绝对路径: 以basePath 为基准下的方式部署的,如果设置则取 设置值,如果不设置 则取默认浏览器对应的BASEPATH										
				var configrue = Hoo.bridge.getConfigrue();
				if(configrue.basePath){
					url = configrue.basePath + cfgs.absolutePath + "?params=" + JSON.stringify(cfgs.params);
				}
			}
			if(null != url){
				if(cfgs.title){ url += ("&title=" + title);}
				window.location.href =  url ;
			}
		},
		// force 在web下不处理 
		back : function(force){
			//实现思路? 
			// 1、在移动端,UC 返回不刷新
			// 2、这里处理,应该默认为返回强制刷新
			// window.history.back();
			window.history.go(-1);
		},
		reload	      : function(){
			window.location.reload();
		},
		backForResult : function(){
			window.history.go(-1);
			window.location.reload();
		},
		replace:function(opts){
			if(Hoo.util.Object.isString(opts)){ opts = { absolutePath : opts }; }
			var cfgs = 	{ relative : false, params: {} },url = null;		
			Hoo.copyTo(opts,cfgs);
			// WEB 优先使用相对路径
			if(cfgs.relativePath){
				url = cfgs.relativePath + "?params=" + JSON.stringify(cfgs.params);
			}else if(cfgs.absolutePath){
				//绝对路径: 以basePath 为基准下的方式部署的,如果设置则取 设置值,如果不设置 则取默认浏览器对应的BASEPATH										
				var configrue = Hoo.bridge.getConfigrue();
				if(configrue.basePath){
					url = configrue.basePath + cfgs.absolutePath + "?params=" + JSON.stringify(cfgs.params);
				}
			}
			if(null != url){
				if(cfgs.title){ url += ("&title=" + title);}
				document.location.replace(url);
			}
		}
	});
	
	Hoo.apply(Hoo.bridge.util.file , {
	    //web不具体实现
		exists : function(){}
	});
	
	Hoo.apply(Hoo.bridge.util.localStorage , {
		setItem : function(key,value){
			Hoo.util.Storage.putLItem(key,value);
		},
		getItem : function(key,callback,dfValue){
			return callback.call(this,typeof dfValue === 'undefined' ? Hoo.util.Storage.getLItem(key) : Hoo.util.Storage.getLItem(key,dfValue));
		}
	});
	
	Hoo.apply(Hoo.bridge.util.url , {
		getUrlParams : function(opts){
			var cfgs = {
					type    : '?', format  : true, zh      : false,key     : null,
					callback: function(params){}
				};
			Hoo.copyTo(opts,cfgs);
			if('?' != cfgs.type){ return; }
			
			var params = null, search = window.location.search;
			if(!Hoo.util.Object.isEmpty(cfgs.key)){
				var name = cfgs.key, reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
				var r = search.substr(1).match(reg);
				if (r != null) {
					params =  cfgs.zh ? decodeURI(r[2]) : unescape(r[2]);
					if(cfgs.format){
						var p  = null;
						try{ p = JSON.parse(params); }catch(e){ p = params; }
						params = p;
					}
				}
			}else{
				params = search === '' ? null : search; 
				if(cfgs.format){
				    if (search.indexOf(cfgs.type) != -1) {
						params = {};
				        var strs = search.substr(1).split("&"),r0 ;
				        for(var i = 0; i < strs.length; i ++) {
				        	r0 = strs[i].split("=")[0];
				        	r1 = strs[i].split("=")[1];
				            params[r0] = cfgs.zh ? decodeURI(r1) : unescape(r1);
				        }
				    }
				}
			}
			cfgs.callback.call(cfgs.scope || this,params);
			return params;
		},
		/**
		 * 
		 * @param {JSON | Array} opts
		 * {
		 * 		params  : [],
		 *      callback: function(map){},
		 *      zh      : false
		 * } | ['key1','key2']
		 * @params {Function} callback
		 * @params {Boolean} zh
		 */
		formatQueryString : function(opts){
			var params,callback,zh,format;
			if(arguments.length > 0 && Hoo.util.Object.isArray(arguments[0])){
				params  = arguments[0];
				callback= arguments[1];
				zh      = arguments[2];
				scope   = arguments[3];
			}else{
				params  = opts.params || [];
				callback= opts.callback || Hoo.emptyFn;
				zh      = opts.zh;
				scope   = opts.scope;
				format  = opts.format;
			}
			if(typeof format === 'undefined'){ format = false; }
			if(typeof zh === 'undefined'){ zh = false;}
			var pvMap = {},name,r,search = window.location.search;
			if('' != search){
				for(var i =0,len = params.length;i<len;i++){
					name = params[i]; 
					   r = search.substr(1).match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"));
				   value = null;
				    if (r != null) {
						value = zh ? decodeURI(r[2]) : unescape(r[2]);
						if(format){
							var p  = null;
							try{ p = JSON.parse(value); }catch(e){ p = value; }
							value = p;
						}
					}
					pvMap[name] = value;
				}
			}
			callback.call(scope || this,pvMap);
			return pvMap;
		}
	});

	Hoo.apply(Hoo.bridge.platform,{
		setTitle : function(title){
			if(Hoo.util.Object.isEmpty(title)){ return; }
			//如果是微信平台,这个需要走hack
			if(document.title == title){ return; }
			document.title = title;
			if(Hoo.util.PlatForm.isWechat && Hoo.util.PlatForm.isIOS) {
				var $body = $('body');
				var $iframe = $('<iframe src="/favicon.ico"></iframe>').hide();
				$iframe.on('load', function() {
					setTimeout(function() { $iframe.off('load').remove(); }, 0);
				}).appendTo($body);
			}
		}
	});
	
	Hoo.apply(Hoo.bridge.project,{
		// web user对象存放到 sessiionStorage 里
		_KEY_USER: '__key_bridge_project_user',
		getUser  : function(callback,scope){
			if(Hoo.util.Object.isFunction(callback)){
				var user = Hoo.util.Storage.getSItem(this._KEY_USER);
				callback.call(scope || this, JSON.parse(user == null ? '{}' : user));
			}
		},
		setUser  : function(user){
			if(Hoo.util.Object.isObject(user)){ user = JSON.stringify(user); }
			Hoo.util.Storage.putSItem(this._KEY_USER,user);
		}
	});
	
	var basePath = null;
	var loc = window.document.location;
	
	if (loc.hostname) { //如果是本地file方式访问(!loc.hostname),则 basePath为null
		var pathname = loc.pathname, 
		     proname = pathname.substring(0, pathname.substr(1).indexOf('/') + 1);
		basePath = (loc.href.substring(0, loc.href.indexOf(pathname)) + proname + "/");
	}else{
		basePath = '';
		basePath = 'http://www.52emp.com/open_cloud/';
	}
	
	Hoo.bridge.initConfigrue({
		basePath : basePath
	});
})();