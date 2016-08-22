/**
 * Hoo hanqing的OO前端框架[该部分实现与2014年04月某日]
 * 
 * 实现方法包含:
 * 	 define
 *   create
 *   override 覆盖原有框架里的属性和方法
 *   apply 实现部分的国际化-参考extjs
 *   this.callParent(arguments);
 *   this.callSuper(name,[args]);//默认name为上下文本身
 *   
 *   
 *   <b>问题</b>:深度继承的问题,例如:
 *   a = {
 *   	b:{
 *   	  c:{},
 *   	  d:{}
 *   	}
 *   }
 *   覆盖b里的d,如果使用a.b直接覆盖的话 会把c也覆盖掉. 这里我联想到 highchart
 *   //当然这里可以适用于局部方法体内去实现
 *   
 *   备注: 循环体方法、fireEvent方法,当返回为true/有真值的时候,跳出(已OK-->应该改为false时退出相同监听的执行?)
 *			动态类加载
 *			错误捕捉(错误捕捉类,同一控制)
 */
var Hoo = window.Hoo || {};
(function(){
	var global 				= this,
		objectPrototype		= Object.prototype,
        toString 			= objectPrototype.toString,
        callOverrideParent 	= function () {//暂保留   继承里的东西 还需要 添加/更改  些东西
            var method = callOverrideParent.caller.caller;
            return method.$owner.prototype[method.$name].apply(this, arguments);
        },
        m 					= __nameSpaceMap = {"Hoo":true};
        Hoo.doc  			= document;
        Hoo.body 			= null,
        version             = '2.1.03';
        
       Hoo.Core 		    = function(){};
        //基类定义
       Hoo.Core.prototype = {
        	$isClass    : true,			//标识是类-函数对象
        	$className  : "Hoo.Core",	//标记类名
        	$superClass : null,			//标记父类(方法变更:不通过prototype也可获取)
        	alias       : null,         //别名
        	callParent : function(){
        		var method = this.callParent.caller;
	            if(method && method.$class && method.$name) {
	                var superClsPrototype = method.$class.$superClass,methodName = method.$name;
	                if(superClsPrototype[methodName]) {
	                    superClsPrototype[methodName].apply(this, arguments||[]);
	                }
	            }
        	},
        	/**
        	 *	将这里的callSuper方法重写为: name为调用的方法名,args为对应的参数
        	 *  即这个方法可以调用父类的名称为name的方法
        	 */
        	callSuper:function(name){
        		var _args=[],args = arguments,i=1,len=args.length;
        		for(;i<len;i++){ _args.push(args[i]); }
        		var method = this.callSuper.caller;
	            if(method && method.$class && method.$name) {
	                var superClsPrototype = method.$class.$superClass,methodName = name;
	                if(superClsPrototype[methodName]) {
	                    superClsPrototype[methodName].apply(this, _args);//这里的参数存疑
	                }else{
	                	throw new Error(methodName+"不存在于类" + superClsPrototype.$className + "中.");
	                }
	            }
        	}
    }
	
	Hoo.apply = function(obj,cfg,defaults){
		if(defaults){
			Hoo.apply(obj,defaults);
		}
		if(obj){
			if(typeof(cfg)==='object'){
				for(var key in cfg){	obj[key] = cfg[key];}
			}else
			if((typeof(cfg) === "function")){
				obj = cfg; //如果是函数,则直接赋值
			}
		}
		return obj;
	}
	
	Hoo.apply(Hoo,{
		idSeed    : 1000,
		debugModel: false,
		version   : version,
		setPath   : function(){
			//设置路径 与 命名空间的 映射
	 	},
		getNameSpaces:function(){
			var arr = [],key;
			for(key in m){arr.push(key);}
			return arr;
		},
		isHaveNameSpace:function(name){
			return m[name] === true;
		},
		/**
		 * 命名空间定义
		 * @example
		 * 		Hoo.nameSpace("Ux","Hq");//命名空间: Ux Hq  
		 */
		nameSpace : function(){
			var args = arguments;
			for(var i=0,len = args.length;i<len;i++){
				if(typeof(args[i])!='string'){continue;}
				if(!m[args[i]]){
					m[args[i]] = true;
					eval("window."+args[i]+"={}");//定义命名空间为全局对象
				}
			}
		}
	});
	Hoo.ns = Hoo.nameSpace;
	
	Hoo.apply(Hoo,{
		name:'Hoo',
		emptyFn:function(){},
		/**
		 * String to Class
		 * 所有都是类
		 */
		s2c:function(clsUrl){
			var cls = clsUrl.split(".");
			if(!window[cls[0]]){this.nameSpace(cls[0]);}
			var clazz = window[cls[0]];
			for(var i=1,len = cls.length;i<len;i++){
				if(clazz[cls[i]]){clazz = clazz[cls[i]];}else{
					throw new Error(clsUrl + "不存在" + cls[i] + "属性!");
				}
			}
			return clazz;
		},
		/**
		 * cfg覆盖obj不重复的部分【多层暂不支持-->>可以通过jQuery支持 备注于 2016-04-15】
		 */
		applyIf:function(obj,cfg){
			if(obj){
				for(var pro in cfg){if(typeof(obj[pro])=='undefined'){obj[pro] = cfg[pro];}}
			}
			return obj;
		},
		/**
		 * 暂支持 from({}对象) copy 给 to({})
		 * @param {Object} from
		 * @param {Object} to
		 */
		copyTo : function(from,to){
			for(var key in from){
				to[key] = from[key];
			}
		}
	});
	
	
	Hoo.apply(Hoo,{
		define:function(clsNameUrl,cfg){
			cfg = cfg || {};
			var names = clsNameUrl.split("."),obj;
			if(!Hoo.isHaveNameSpace([names[0]])){Hoo.nameSpace(names[0]);}
			obj = window[names[0]];
			var statics = cfg['statics'],extendClsUrl = cfg['extend'];
			for(var i=1,len = names.length;i<len;i++){
				if(i == len-1){
					//如果是静态类,执行静态方式
					if(statics){
						if(!obj[names[i]])obj[names[i]] = {};
						for(var key in statics){obj[names[i]][key] = statics[key];}
						return obj[names[i]];
					}
					//如果是通过继承,则执行继承方式
					if(extendClsUrl){
						var extendCls = Hoo.s2c(extendClsUrl),
							F = function(){},
							cls = obj[names[i]];
						if(!cls){
							F.prototype = extendCls.prototype; 
							cls = obj[names[i]] = function(){if(this.init)this.init.apply(this,arguments||[]);};
							cls.prototype = new F();
						}else{
							throw new Error("定义的类:"+clsNameUrl+",命名空间路径冲突!");
						}
						for(var key in cfg){
							var v = cfg[key];
							if(typeof(v)==='function'){
								v.$class = cls;
								v.$name = key;
							}
							cls.prototype[key] = v;
						}
						cls.prototype['$className'] = clsNameUrl;
						cls['$superClass'] = extendCls.prototype;
						cls.prototype.constructor = cls;
						return cls;
					}
					//如果两者均无,则执行函数的创建
					if(!statics&&!extendClsUrl){
						var F = function(){},cls = obj[names[i]];
						F.prototype =Hoo.Core.prototype;
						if(!cls){
							cls = obj[names[i]] = function(){if(this.init)this.init.apply(this,arguments||[]);};
							cls.prototype = new F();
						}else{ 
							throw new Error("定义的类:"+clsNameUrl+",命名空间路径冲突!");
						}
						for(var key in cfg){
							var v = cfg[key];
							if(typeof(v)==='function'){
								v.$class = cls;
								v.$name = key;
							}
							cls.prototype[key] = v;
						}
						cls.prototype['$className'] = clsNameUrl;
						cls['$superClass'] =Hoo.Core.prototype;
						cls.prototype.constructor = cls;
						return cls;
					}	
				}
				if(!obj[names[i]]){obj[names[i]] = {};}
				obj = obj[names[i]];
			}
		},
		/**
		 * 这里仿造ExtJS 将入口命名为 onCreate ,所有方法执行,均重写该接口即可
		 * 
		 * @example
		 * 		Hoo.create('Hoo.base.Base',{
		 * 			name:'ssss', // 覆盖名称
		 * 			onCreate : function(cfg){
		 * 				console.log(cfg); // {key:'初始数据'}
		 * 		}},{
		 * 			key:'初始数据'
		 * 		});
		 */
		create:function(clsNameUrl,cfg,data){
			var Cls = Hoo.s2c(clsNameUrl);
			var F = function(){},
		   tempFn = function(){
				if(this.init)this.init.apply(this,arguments||[]);
				//作为所有create的入口
			    if(this.onCreate){this.onCreate.apply(this,arguments||{});}
			};
			F.prototype = Cls.prototype;
			tempFn.prototype = new F();
			for(var key in cfg){ tempFn.prototype[key] = cfg[key]; }
			tempFn.prototype.constructor = tempFn;
			return new tempFn(data||{});
		}
	});
	
	Hoo.apply(Hoo,{
		/**
		 * 得到全局唯一ID
		 */
		getId:(function(){
			var id = Hoo.idSeed,getId = function(nodeType){  
		        id += 1;  
		        return (nodeType ? nodeType : "component_") + id;  
		    };  
		    return getId;
		})(),
		getBody:function(){
			if(!Hoo.body) Hoo.body = Hoo.doc.body;
			return Hoo.body;
		},
		onReady:function(callback){
			var me = window;
			window.onload = function(){
				callback.call(window);
			}
		},
		// 引入 $ 支持 [如果没,用{}代替,但暂时没提供 类$ 支持]
		$ : (function(){
			return (typeof jQuery === 'undefined') ? (typeof $ === 'undefined' ? {} : $) : jQuery;
		})()
	});
	
})();/**
 * 凡用于框架搭建的,均可继承该类【引发的一个问题: a->b->c c层的继承如果重写,则不调用不生效】
 */
(function(){
//这里有待解决的一个问题是: 如何在监听的fireEvent里有返回值?
Hoo.define("Hoo.Base",{
		listeners : {},
		init:function(){
			this.initListeners();
			this.initEvents();
			
			this.inited();
		},
		inited : function(){
			//构建监听
			var scope = this.listeners.scope || this,callback;
			for(var eventName in this.listeners){
				if(eventName === 'scope'){ continue; }
				callback = this.listeners[eventName];
				if(Hoo.util.Object.isFunction(callback)){
					this.addListeners(eventName,callback,scope);
				}
			}
		},
		initListeners:function(){
			this.listenerStack = {};
		},
		initEvents:function(){
			this.events = {};
		},
		/*** 添加事件 */
		addEvents:function(){
			var param = arguments[0];
			if(Hoo.util.Object.isString(param)){
				for(var i=0;i<arguments.length;i++){
					this.events[arguments[i].toLowerCase()] = true;
				}
			}else if(Hoo.util.Object.isObject(param)){
				for(var key in param){ 
					this.events[key].toLowerCase() = true; 
				}
			}
		},
		//暂不启用
		addEvent:function(eventName){
			eventName = eventName.toLowerCase();
			this.events[eventName] = true; 
		},
		//暂不启用
		removeEvent:function(eventName){
			eventName = eventName.toLowerCase();
			delete this.events[eventName]; 
		},
		/**
		 * 移除事件(未做测试--应该是错误的.)
		 */
		removeEvents:function(){
			var param = arguments[0];
			if(this.isString(param)){
				for(var i=0;i<arguments.length;i++){ 
					this.removeEvent(arguments[i].toLowerCase());
				}
			}else if(this.isObject(param)){
				for(var key in param){ this.removeEvent(key.toLowerCase()); }
			}
		},
		/**
		 * 触发监听事件 当事件返回true时,事件链停止执行
		 * 即:若在某些场景下 不想继续往下执行,则回调中返回true即可.
		 */
		fireEvent:function(eventName){
			eventName = eventName.toLowerCase();
			if(this.listenerStack[eventName]){
				var args = [],stackArr = this.listenerStack[eventName],stack;
				for(var i=1,len = arguments.length;i<len;i++){ args.push(arguments[i]); }
				var res = false;
				for(var i=0,len = stackArr.length;i<len;i++){
					//这里执行同一个监听的多次回调.........................
					stack = stackArr[i];
					res = stack.callback.apply(stack.scope,args);
					if(res){break;}
				}
				return res;
			} else{
				//throw new Error('名称为:' + eventName + '的事件不存在或不被允许！');
			}
		},
		on:function(){
			this.addListeners.apply(this,arguments);
		},
		/**
		 * @param {String/Object} eventName 事件名称,同时支持{}形式
		 */
		addListeners:function(eventName,callback,scope){
			var stack = this.listenerStack;
			if(Hoo.util.Object.isString(eventName)&&Hoo.util.Object.isFunction(callback)){
				eventName = eventName.toLowerCase();
				if(this.events[eventName]){
					if(!stack[eventName]){ stack[eventName] = []; }
					stack[eventName].push({ callback:callback||function(){}, scope:scope||this });
				}
			}else{
				if(callback){throw new Error('该形式不支持回调!');return;}
				var me = this,obj = eventName,scope = obj['scope']||this;
				delete obj['scope'];
				for(var _eventName in obj){
					var eventName = _eventName.toLowerCase();
					if(this.events[eventName]){
						if(!stack[eventName]){ stack[eventName] = []; }
						stack[eventName].push({ callback:obj[_eventName]||function(){}, scope:scope });
					}
					//监听不被允许
				}
			}
		}
	});
})();/**
 * 用于国际化,默认语言包放置中文
 */
/**
 * 日志工具类
 */
(function(){
	var toString = function(msg){
		if(Hoo.util.Object){
			return Hoo.util.Object.toString(msg);
		}else{
			return msg;
		}
	}
	var ef = function(){},console = window.console || { log:ef,error:ef,warn:ef,assert:ef };
	Hoo.define("Hoo.util.Logger",{
		statics : {
			info :function(msg,tag){
				if(Hoo.debugModel){ 
					console.log(typeof tag == 'undefined' ? msg : (tag + " : " + toString(msg))); 
				}
			},
			error:function(msg,tag){
				if(Hoo.debugModel){ 
					console.error(typeof tag == 'undefined' ? msg : (tag + " : " + toString(msg))); 
				}
			},
			warn :function(msg,tag){
				if(Hoo.debugModel){ 
					console.warn(typeof tag == 'undefined' ? msg : (tag + " : " + toString(msg))); 
				}
			},
			/**
			 * 断言
			 * @param {Object} equal 等式
			 * @param {Object} msg 相等,不提示;不相等则提示错误
			 */
			assert : function(equal,msg,tag){
				if(Hoo.debugModel){
					console.assert(equal,typeof tag === 'undefined' ? msg : (tag + " : " + toString(msg)));
				}
			}
		}
	});
	
})();/**
 * 对象操作相关工具类
 */
(function(){
	var objectPrototype		= Object.prototype,
        toString 			= objectPrototype.toString;
	Hoo.define('Hoo.util.Object',{
		statics : {
			toString  : function(object){
				if(this.isObject(object)){
					try{
						return JSON.stringify(object);						
					}catch(e){
						return object;
					}
				}
				return object;
			},
			isDOM  : ( typeof HTMLElement === 'object' ) ?
            function(obj){
                return obj instanceof HTMLElement;
            } :
            function(obj){
                return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
            },
			isArray:function(arr){
				return (typeof(arr)==='undefined' || arr == null) ? false : (arr instanceof Array);
			},
			isFunction:function(fn){
				return (typeof(fn) === "function");
			},
			isString:function(str){
				return (typeof(str) === "string");
			},
			isObject:(toString.call(null) === '[object Object]') ?
	        function(value) {
	            return value !== null && (typeof value !== 'undefined') && toString.call(value) === '[object Object]' && (typeof value.ownerDocument === 'undefined');
	        }: 
	        function(value) { 
	        	return toString.call(value) === '[object Object]'; 
	        },
		    isEmpty:function(data){
	        	if(this.isObject(data)){
	        	   if(this.isFunction(data)){ return false; }
	        	   try{
	        		   var flag = true;
		        	   for(var key in data){ flag = false; break;}
		        	   return flag;
	        	   }catch(e){
	        		   return false;
	        	   }
	        	}
	        	return (typeof data == 'undefined') || data == null || data === '' || data.length == 0 || data.replace(/(^\s*)|(\s*$)/g, "").length == 0;
		    },
		    each:function(obj,callback,scope){
				if(Hoo.util.Object.isObject(obj)&&Hoo.util.Object.isFunction(callback)){
					for(var key in obj){
						if(callback.call(scope||obj,obj[key],key)){break;};
					}
				}
			},
			// "true"  => true
		    // "false" => false
		  	// "null"  => null
		  	// "42"    => 42
		  	// "42.5"  => 42.5
		  	// JSON    => parse if valid
		  	// String  => self
			deserializeValue:function(value) {
			    var num;
			    try {
			      return value ? value == "true" || ( value == "false" ? false : value == "null" ? null : !isNaN(num = Number(value)) ? num : /^[\[\{]/.test(value) ? JSON.parseJSON(value) : value ) : value
			    } catch(e) {
			      return value
			    }
			  }
		}
	});
})();/**
 * 数组操作相关
 */
(function() {

	Hoo.define("Hoo.util.Array", {
		statics : {
			/**
			 * 移除arr中指定值value
			 * @param {Object} arr     数组
			 * @param {String|Number} value   值
			 * @param {Boolean} vague 值是否区分大小写
			 */
			remove : function(arr,value,vague){
				if(typeof vague === 'undefined'){ vague= true; }
				//IE8 &-
				if(!Array.prototype.indexOf) {
   					Array.prototype.indexOf = function(what, i) {
				        i = i || 0; var L = this.length; while (i < L) { if(this[i] === what) return i; ++i;  }  return -1;
				    };
				}
				var remove = function(arr,value){
					var ax;
					while ((ax= arr.indexOf(value)) !== -1) {
			            arr.splice(ax, 1);
			        }
				}
				
				remove(arr,value);
				
				if(!vague){
					value = value.toUpperCase();
					remove(arr,value);
					value = value.toLowerCase();
					remove(arr,value);
				}
				
				return arr;
			},
			each : function(arr, callback, scope) {
				if (Hoo.util.Object.isArray(arr)
						&& Hoo.util.Object.isFunction(callback)) {
					for ( var i = 0, len = arr.length; i < len; i++) {
						if (callback.call(scope || arr, arr[i], i)) {
							break;
						}
						;
					}
				}
			},
			contains : function(arr, element) {
				var len = arr.length;
				while (len--) {
					if (arr[len] == element) {
						return true;
					}
				}
				return false;
			},
			replace : function(arr,index,newEle){
				return arr.splice(index,1,newEle);// return oleEle
			}
		}
	});

})();/**
 * 日期操作工具类
 */
(function(){
	
	Hoo.define("Hoo.util.Date",{
		statics : {
			/**
			 * 将time转成Date对象
			 * 
			 * @param {Date|Number|String}
			 *            time
			 * @return {Date}
			 */
			getDate : function(time) {
				time = time || new Date();
				return (time instanceof Date) ? time
						: ((typeof (time) === 'number') ? new Date(time)
								: (new Date((time || "").replace(/-/g, "/")))); // 传递的时间(yyyy-MM-dd
																				// hh:ii:ss)的组合形式
			},
			isLeapYear : function(time) {
				var y = Hoo.util.Validate.isNum(time) ? time : (this.getDate(time).getFullYear());
				
				return (y % 4 == 0 && y % 100 != 0)
						|| (y % 100 == 0 && y % 400 == 0);
			},
			getLongSecond : function(time) {
				return this.getMillisecond(time) / 1000;
			},
			getMillisecond : function(time) {
				var date = this.getDate(time);
				return date.getTime();
			},
			/**
			 * 日期格式化(与Java日期格式化相同)
			 * 
			 * @param {Date}
			 *            date
			 * @param {String}
			 *            fmt
			 * @return {String}
			 */
			format : function(date, fmt) {
				var o = {
					"M+" : (date.getMonth() + 1),// 月份
													// >9?date.getMonth()+1:'0'+(date.getMonth()+1)
					"d+" : date.getDate(),// 日
											// >9?date.getDate():'0'+date.getDate()
					"h+" : date.getHours(), // 小时
											// >9?date.getHours():'0'+date.getHours()
					"i+" : date.getMinutes(), // 分
												// >9?date.getMinutes():'0'+date.getMinutes()
					"s+" : date.getSeconds(), // 秒
					"q+" : Math.floor((date.getMonth() + 3) / 3), // 季度
					"S" : date.getMilliseconds() // 毫秒
				};
				if (/(y+)/.test(fmt)) {
					fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "")
							.substr(4 - RegExp.$1.length));
				}
				for ( var k in o) {
					if (new RegExp("(" + k + ")").test(fmt)) {
						fmt = fmt.replace(RegExp.$1,
								(RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k])
										.substr(("" + o[k]).length)));
					}
				}
				return fmt;
			},
			/**
			 * 将时间点(戳)转换为时间轴
			 * 
			 * @param {Date|Number|String}
			 *            time
			 * @return {String}
			 */
			prettyDate : function(time) {
				var date = this.getDate(time), // 传递的时间(yyyy-MM-dd hh:ii:ss)的组合形式
				diff = (((new Date()).getTime() - date.getTime()) / 1000), // 当前时间与传递时间间隔(秒)
				day_diff = Math.floor(Math.abs(diff) / 86400), // 转换为天
				unit = '前', // 单位(扩展支持 未来时间)
				isReversal = (diff < 0) ? true : false; // 是否需要翻转(之前和之后)
	
				// 昨天-明天 % 前天-后天
				if (isReversal) {
					unit = '后';
					diff = Math.abs(diff);
				}
	
				var year = date.getFullYear(), month = date.getMonth() + 1;
				var days = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
				if (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) {
					days[1] = 29;
				}
	
				if (isNaN(day_diff)) {
					return '';
				}
	
				if (day_diff >= 7) {// 以下需要选择 一个策略 来判断 ,同时应该还需要formater日期
					// 如果在本月
					if (day_diff < days[month]) {
						return Math.ceil(day_diff / 7) + "周" + unit;
					}
					// 如果在三个月内(可以再优化,不精准,另外还要解决下【跨年】的问题->所以此处还可以优化)
					var daysTotal = 0, temp = 0;
					for ( var i = month; i < (month + 3); i++) {
						temp = i;
						if (temp >= 12) {
							temp = temp - 12;
						}
						daysTotal += days[temp];
					}
					if (day_diff < daysTotal) {
						return '约' + Math.floor(day_diff / 30) + '个月' + unit;
					}
	
					return this.format(date, "yyyy-MM-dd");// 格式化函数进行格式化
				}
				// 三天内的判断
				return (diff < 60 && "刚刚" || diff < 120 && ("1分钟" + unit)
						|| diff < 3600 && (Math.floor(diff / 60) + "分钟" + unit)
						|| diff < 7200 && ("1小时" + unit) || diff < 86400
						&& (Math.floor(diff / 3600) + "小时" + unit))
						|| day_diff == 1
						&& ((isReversal ? "明天" : "昨天") + this.format(date, 'hh:ii'))
						|| day_diff == 2
						&& (isReversal ? "后天" : "前天")
						|| day_diff < 7 && (day_diff + "天" + unit);
			},
	
			/**
			 * 将时间点(戳)转换为时间轴
			 * 
			 * @param {Date|Number|String}
			 *            time
			 * @return {String}
			 */
			perttyDate4Day : function(time) {
				var date = this.getDate(time); // 传递的时间(yyyy-MM-dd hh:ii:ss)的组合形式
				var todaystr = this.format(new Date(), "yyyy-MM-dd");
				var todaydate = new Date(todaystr.replace(/-/g, "/"));// 得到今天的date形式.
				var daydiff = 24 * 60 * 60 * 1000;
				var diff = date.getTime() - todaydate.getTime();
				if (date.getFullYear() - todaydate.getFullYear() === 0) {// 对本年只输出"月-日"
					if (diff >= 0 && diff < daydiff) {// 今天
						return "tdy";
					} else if (diff >= daydiff && diff < daydiff * 2) {// 明天
						return "tmw";
					} else if (diff >= 2 * daydiff && diff < daydiff * 3) {// 后天
						return "tdat";
					} else if (diff >= (-1) * daydiff && diff < 0) {// 昨天
						return "ydy";
					} else if (diff >= (-2) * daydiff && diff < daydiff * (-1)) {// 前天
						return "tdby";
					} else { // 只有"月-日".
						return this.format(date, "MM-dd");
					}
				} else {// 返回"年-月-日"
					return this.format(date, "yyyy-MM-dd");
				}
			},
			/**
			 * 只得到给定时间点的时分：hh:ii
			 * 
			 * @param {Date|Number|String}
			 *            time
			 * @return {String}
			 */
			getHM : function(time) {
				var date = this.getDate(time);
				return this.format(date, "hh:ii");
			},
			/**
			 * 判断给定的时间是否早于当前时间(过时)
			 * 
			 * @param {Date|Number|String}
			 *            time
			 * @return boolean true:早于,false:不早于
			 */
			isOutTime : function(time) {
				var date = this.getDate(time);
				var now = new Date();
				return date.getTime() < now.getTime() ? true : false;
			},
			/**
			 * 获取两个时间相差的时间轴信息[http://blog.csdn.net/shen516/article/details/10390983]
			 * 
			 * @param start
			 *            开始时间
			 * @param end
			 *            结束时间
			 */
			getTimeAxis : function(start, end) {
				var sd = this.getDate(start), ed = this.getDate(end), bf = (ed
						.getTime() - sd.getTime());
				if (bf < 0) {
					return '时间不合理.';
				}
				var df = Math.floor(Math.abs(bf) / 86400000);// 转换为天
				var hf = Math.floor((Math.abs(bf) % 86400000) / 3600000);
				var mf = Math.floor(((Math.abs(bf) % 86400000) % 3600000) / 60000);
				// sf 秒暂不参与计算
				return (df == 0 ? '' : (df + '天'))
						+ ((df == 0 && hf == 0) ? '' : ((hf == 0 ? '0' : hf) + '时'))
						+ (mf + '分');
			},
			/**
			 * 分钟转字符串
			 * 570 --> 09:30 [即9点30分]
			 * @param {Number} num
			 */
			m2s:function(num){
				var hour = parseInt(num / 60) ,minutes = num % 60;
				if(hour < 10){ hour = '0' + hour; }
				if(minutes < 10){ minutes = '0' + minutes; }
				return hour + ':' + minutes;
			}
	}});
	
})();
/**
 * 集合工具类相关工具类
 */
(function() {

	Hoo.define("Hoo.util.Map", {
		statics : {
			size : function(map) {
				var num = 0;
				for ( var key in map) {
					num++; // num += 1;
				}
				return num;
			},
			containsKey : function(map, key) {
				return typeof map[key] != 'undefined';
			},
			containsValue : function(map, value) {
				for ( var key in map) {
					if (value === map[key]) {
						return true;
					}
				}
				return false;
			}
		}
	});

})();/**
 * 数学相关工具类
 */
/**
 * 字符串操作相关
 */
(function(){
	
	Hoo.define("Hoo.util.String",{
		statics:{
			trimAll : function(str){
				return str.replace(/\s/g,"");
			},
			/**
			 * 将from全部替换为to 特殊字符请转义
			 * @param {Object} str
			 * @param {Object} from
			 * @param {Object} to
			 * @return {TypeName} 
			 */
			replaceAll : function(str,from,to){
				return str.replace(new RegExp(from,"gm"),to);
			},
			/**
			 * 格式化字符串 var str = '我是一颗{0},下句是:{1}';
			 * format(str,'小小的石头','深深的埋在泥土之中');//执行结果: 我是一颗小小的石头,下句是:深深的埋在泥土之中
			 * @return {String}
			 */
			format : function() {
				if (arguments.length > 0) {
					var s = arguments[0];
					if (arguments.length == 1) { return s; }
					for ( var i = 0; i < arguments.length - 1; i++) {
						s = s.replace(new RegExp("\\{" + i + "\\}", "g"),arguments[i + 1]);
					}
					return s;
				}
				return null;
			},
			format2:function(str,simpleMap,handlerMap){
				if(typeof str !== 'undefined' && typeof simpleMap !== 'undefined'){
					if(typeof handlerMap === 'undefined'){ handlerMap = {}; }
					var s = str,v;
					for(var key in simpleMap){
						v = simpleMap[key];
						if(typeof handlerMap[key] != 'undefined' && Hoo.util.Object.isFunction(handlerMap[key])){
							v = handlerMap[key].call(simpleMap,key,v);
						}
						s = s.replace(new RegExp('\\{' + key + '\\}','g'),v);
					}
					return s;
				}
				return null;
			},
			/**
			 * str是否是reg开头的字符串
			 * 
			 * @param {String} str
			 * @param {String} reg
			 * @return {Boolean}
			 */
			startWith : function(str, reg) {
				var r = new RegExp("^" + reg);
				return r.test(str);
			},
			/**
			 * str是否是reg结尾的字符串
			 * 
			 * @param {String} str
			 * @param {String} reg
			 * @return {Boolean} 
			 */
			endWith : function(str, reg) {
				var r = new RegExp(reg + "$");
				return r.test(str);
			}
		}
	});
	
})();/**
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
/**
 * 浏览器工具类[来自 Ext JS]
 */

(function(){
	/*
	FF 3.6      - Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.17) Gecko/20110420 Firefox/3.6.17
	FF 4.0.1    - Mozilla/5.0 (Windows NT 5.1; rv:2.0.1) Gecko/20100101 Firefox/4.0.1
	FF 5.0      - Mozilla/5.0 (Windows NT 6.1; WOW64; rv:5.0) Gecko/20100101 Firefox/5.0
	
	IE6         - Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1;)
	IE7         - Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; SV1;)
	IE8         - Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0)
	IE9         - Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)]
	IE10        - Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; MS-RTC LM 8)
	
	Chrome 11   - Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.60 Safari/534.24
	
	Safari 5    - Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1
	
	Opera 11.11 - Opera/9.80 (Windows NT 6.1; U; en) Presto/2.8.131 Version/11.11
	*/
    var    ua = navigator.userAgent.toLowerCase(),
        check = function(regex){
            return regex.test(ua);
        },
        isStrict = document.compatMode == "CSS1Compat",
        version = function (is, regex) {
            var m;
            return (is && (m = regex.exec(ua))) ? parseFloat(m[1]) : 0;
        },
        docMode = document.documentMode,
        isOpera = check(/opera/),
        isOpera10_5 = isOpera && check(/version\/10\.5/),
        isChrome = check(/\bchrome\b/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari2 = isSafari && check(/applewebkit\/4/), // unique to Safari 2
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isSafari5_0 = isSafari && check(/version\/5\.0/),
        isSafari5 = isSafari && check(/version\/5/),
        isIE = !isOpera && check(/msie/),
        isIE7 = isIE && ((check(/msie 7/) && docMode != 8 && docMode != 9 && docMode != 10) || docMode == 7),
        isIE8 = isIE && ((check(/msie 8/) && docMode != 7 && docMode != 9 && docMode != 10) || docMode == 8),
        isIE9 = isIE && ((check(/msie 9/) && docMode != 7 && docMode != 8 && docMode != 10) || docMode == 9),
        isIE10 = isIE && ((check(/msie 10/) && docMode != 7 && docMode != 8 && docMode != 9) || docMode == 10),
        isIE6 = isIE && check(/msie 6/),
        isGecko = !isWebKit && check(/gecko/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isGecko4 = isGecko && check(/rv:2\.0/),
        isGecko5 = isGecko && check(/rv:5\./),
        isGecko10 = isGecko && check(/rv:10\./),
        isFF3_0 = isGecko3 && check(/rv:1\.9\.0/),
        isFF3_5 = isGecko3 && check(/rv:1\.9\.1/),
        isFF3_6 = isGecko3 && check(/rv:1\.9\.2/),
        
        chromeVersion = version(true, /\bchrome\/(\d+\.\d+)/),
        firefoxVersion = version(true, /\bfirefox\/(\d+\.\d+)/),
        ieVersion = version(isIE, /msie (\d+\.\d+)/),
        operaVersion = version(isOpera, /version\/(\d+\.\d+)/),
        safariVersion = version(isSafari, /version\/(\d+\.\d+)/),
        webKitVersion = version(isWebKit, /webkit\/(\d+\.\d+)/),
        isSecure = /^https/i.test(window.location.protocol),
        nullLog;
	//isIOS:function(){}, isAndroid:function(){},
			 
    // remove css image flicker
    try {
        document.execCommand("BackgroundImageCache", false, true);
    } catch(e) {}


    Hoo.define('Hoo.util.Brower', {
		statics : {
	    	/**
	    	 * 是否是安全链接(https://开头)
	    	 */
    	    isSecure : isSecure,
			// IE10 quirks behaves like Gecko/WebKit quirks, so don't include it here
			isIEQuirks: isIE && (!isStrict && (isIE6 || isIE7 || isIE8 || isIE9)),
			/**
			 * True if the detected browser is Opera.
			 * @type Boolean
			 */
			isOpera : isOpera,
			/**
			 * True if the detected browser is Opera 10.5x.
			 * @type Boolean
			 */
			isOpera10_5 : isOpera10_5,
			/**
			 * True if the detected browser uses WebKit.
			 * @type Boolean
			 */
			isWebKit : isWebKit,
			/**
			 * True if the detected browser is Chrome.
			 * @type Boolean
			 */
			isChrome : isChrome,
			/**
			 * True if the detected browser is Safari.
			 * @type Boolean
			 */
			isSafari : isSafari,
			/**
			 * True if the detected browser is Safari 3.x.
			 * @type Boolean
			 */
			isSafari3 : isSafari3,
			/**
			 * True if the detected browser is Safari 4.x.
			 * @type Boolean
			 */
			isSafari4 : isSafari4,
			/**
			 * True if the detected browser is Safari 5.x.
			 * @type Boolean
			 */
			isSafari5 : isSafari5,
			/**
			 * True if the detected browser is Safari 5.0.x.
			 * @type Boolean
			 */
			isSafari5_0 : isSafari5_0,
			/**
			 * True if the detected browser is Safari 2.x.
			 * @type Boolean
			 */
			isSafari2 : isSafari2,
			/**
			 * True if the detected browser is Internet Explorer.
			 * @type Boolean
			 */
			isIE : isIE,
			/**
			 * True if the detected browser is Internet Explorer 6.x.
			 * @type Boolean
			 */
			isIE6 : isIE6,
			/**
			 * True if the detected browser is Internet Explorer 7.x.
			 * @type Boolean
			 */
			isIE7 : isIE7,
			/**
			 * True if the detected browser is Internet Explorer 7.x or lower.
			 * @type Boolean
			 */
			isIE7m : isIE6 || isIE7,
			/**
			 * True if the detected browser is Internet Explorer 7.x or higher.
			 * @type Boolean
			 */
			isIE7p : isIE && !isIE6,
			/**
			 * True if the detected browser is Internet Explorer 8.x.
			 * @type Boolean
			 */
			isIE8 : isIE8,
			/**
			 * True if the detected browser is Internet Explorer 8.x or lower.
			 * @type Boolean
			 */
			isIE8m : isIE6 || isIE7 || isIE8,
			/**
			 * True if the detected browser is Internet Explorer 8.x or higher.
			 * @type Boolean
			 */
			isIE8p : isIE && !(isIE6 || isIE7),
			/**
			 * True if the detected browser is Internet Explorer 9.x.
			 * @type Boolean
			 */
			isIE9 : isIE9,
			/**
			 * True if the detected browser is Internet Explorer 9.x or lower.
			 * @type Boolean
			 */
			isIE9m : isIE6 || isIE7 || isIE8 || isIE9,
			/**
			 * True if the detected browser is Internet Explorer 9.x or higher.
			 * @type Boolean
			 */
			isIE9p : isIE && !(isIE6 || isIE7 || isIE8),
			/**  
			 * True if the detected browser is Internet Explorer 10.x.
			 * @type Boolean
			 */
			isIE10 : isIE10, 
			/**
			 * True if the detected browser is Internet Explorer 10.x or lower.
			 * @type Boolean
			 */
			isIE10m : isIE6 || isIE7 || isIE8 || isIE9 || isIE10,
			/**
			 * True if the detected browser is Internet Explorer 10.x or higher.
			 * @type Boolean
			 */
			isIE10p : isIE && !(isIE6 || isIE7 || isIE8 || isIE9),
			/**
			 * True if the detected browser uses the Gecko layout engine (e.g. Mozilla, Firefox).
			 * @type Boolean
			 */
			isGecko : isGecko,
			/**
			 * True if the detected browser uses a Gecko 1.9+ layout engine (e.g. Firefox 3.x).
			 * @type Boolean
			 */
			isGecko3 : isGecko3,
			/**
			 * True if the detected browser uses a Gecko 2.0+ layout engine (e.g. Firefox 4.x).
			 * @type Boolean
			 */
			isGecko4 : isGecko4,
			/**
			 * True if the detected browser uses a Gecko 5.0+ layout engine (e.g. Firefox 5.x).
			 * @type Boolean
			 */
			isGecko5 : isGecko5,
			/**
			 * True if the detected browser uses a Gecko 5.0+ layout engine (e.g. Firefox 5.x).
			 * @type Boolean
			 */
			isGecko10 : isGecko10,
			/**
			 * True if the detected browser uses FireFox 3.0
			 * @type Boolean
			 */
			isFF3_0 : isFF3_0,
			/**
			 * True if the detected browser uses FireFox 3.5
			 * @type Boolean
			 */
			isFF3_5 : isFF3_5,
			/**
			 * True if the detected browser uses FireFox 3.6
			 * @type Boolean
			 */
			isFF3_6 : isFF3_6,
			/**
			 * True if the detected browser uses FireFox 4
			 * @type Boolean
			 */
			isFF4 : 4 <= firefoxVersion && firefoxVersion < 5,
			/**
			 * True if the detected browser uses FireFox 5
			 * @type Boolean
			 */
			isFF5 : 5 <= firefoxVersion && firefoxVersion < 6,
			/**
			 * True if the detected browser uses FireFox 10
			 * @type Boolean
			 */
			isFF10 : 10 <= firefoxVersion && firefoxVersion < 11,
			/**
			 * URL to a 1x1 transparent gif image used by Ext to create inline icons with
			 * CSS background images. In older versions of IE, this defaults to
			 * "http://sencha.com/s.gif" and you should change this to a URL on your server.
			 * For other browsers it uses an inline data URL.
			 * @type String
			 */
			BLANK_IMAGE_URL : (isIE6 || isIE7) ? '/' + '/www.sencha.com/s.gif' : 'data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
		}});
}());/**
 * cookie操作相关
 */
(function(){
	
	Hoo.define("Hoo.util.Cookie",{
		statics : {
			/**
			 * 设置cookie
			 * 
			 * @params {String} name
			 * @params {Object} value
			 * @params {Number} days
			 */
			setCookie : function(name, value, days) {
				if (typeof days === 'undefined') { days = 1; }
				var exp = new Date();
				exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
				document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
			},
			/**
			 * 获取cookie中key对应的值,默认返回null
			 * 
			 * @params {String} name
			 * @params {Object} defaultValue
			 */
			getCookie : function(name, defaultValue) {
				if (document.cookie.length > 0) {
					var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
					if (arr = document.cookie.match(reg)) {
						return unescape(arr[2]);
					}
				}
				return (typeof defaultValue === 'undefined') ? null : defaultValue;
			},
			removeCookie : function(name) {
				var exp = new Date();
				exp.setTime(exp.getTime() - (1 * 24 * 60 * 60 * 1000));
				var cval = this.getCookie(name);
				if (cval != null) {
					document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
				}
			}
		}
	});
	
})();/**
 * 平台相关工具类
 */
(function(){
	var agents = [ "iphone", "ipad", "ipod", "wp7", "android", "blackberry","spark", "warning", "symbian", "symbianos", "windows phone" ],
		  app = navigator.appVersion;
	var    ua = navigator.userAgent.toLowerCase(),
        check = function(regex){
            return regex.test(ua);
        },
        userAgent = navigator.userAgent,
        isWindows = check(/windows|win32/),
        isMac     = check(/macintosh|mac os x/),
        isLinux   = check(/linux/),
        isIOS     = (function(){
        	return !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        })(),
        isAndroid = (function(){
        	return (userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1);
        })(),
        isWechat  = (function(){
			return ua.match(/MicroMessenger/i) == 'micromessenger';
        })(),
        isPC      = (function(){
        	var flag = true;
			for ( var v = 0; v < agents.length; v++) {
				if (ua.indexOf(agents[v]) > 0) { flag = false; break; }
			}
			return flag;
        })(),
        isIphone  = (function(){
        	return (userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('Mac') > -1);
        })();
    Hoo.define("Hoo.util.PlatForm",{
		statics : {
			isWindows : isWindows,
			isMac     : isMac,
			isLinux   : isLinux,
			isIOS     : isIOS,
			isAndroid : isAndroid,
			isWechat  : isWechat,
			isPC      : isPC,
			isMobile  : !isPC,
			isIphone  : isIphone
		}
	});
    
})();/**
 * 本地存储相关操作
 */
(function() {
	var _setItem = function(key, value,storageObj) {
				if (storageObj) { storageObj.setItem(key, value); return true;}
				return false;
			},
		_getItem = function(key,storageObj, dfValue) {
				var val = null;
				if (storageObj) { val = storageObj.getItem(key); }
				return val == null ? ((typeof dfValue === 'undefined') ? null : dfValue) : val;
			};
	Hoo.define("Hoo.util.Storage", {
		statics : {
			putSItem: function(key,value){
				return _setItem(key,value,window.sessionStorage);
			},
			getSItem: function(key,dfValue){
				return _getItem(key,window.sessionStorage);
			},
			putLItem : function(key,value){
				return _setItem(key,value,window.localStorage);
			},
			getLItem : function(key,dfValue){
				return _getItem(key,window.localStorage,dfValue);
			}
		}
	});
})();/**
 * url操作相关供工具类
 */
(function(){
	Hoo.define("Hoo.util.Url",{
		statics:{
			/**
	         * 将p格式化成url字符串
	         * 默认  : { name:'hank', age : 11 }
	         * 转换后: name='hank'&age=12
	         * @param {Object} p
	         * @param {Function} f 格式化函数
	         * @param {Object} l1 连接字符 =
	         * @param {Object} l2 连接字符 &
	         */
	        format: function(p, f, l1, l2){
	            var s = [];
	            if(p){
	            	for(var n in p){
	            		s.push(n + (l1 || "=") + (f || encodeURIComponent)(p[n]));
	            	}
	            }
	            return s.join(l2 || "&");
	        },
	        /**
	         * 将url字符串格式化{}
	         * @param {Object} url
	         */
	        unformat:function(url){
	        	var params = null;
	        	if(url.indexOf('?')> -1){
	        		url = url.substr(url.indexOf('?'));
	        		if(url.length > 1){
	        			params = {};
	        			url    = url.substr(1);
	        			var strs = url.split("&"),key,value;
	        			for(i=0;i < strs.length; i++){ 
						    key   = strs[i].split("=")[0];
						    value = unescape(strs[i].split("=")[1]);
						    params[key] = value;
						}
	        		}
	        	}
	        	return params;
	        }
		}
	});
})();/**
 * 验证、正则相关工具类
 */
(function() {
	Hoo.define("Hoo.util.Validate",{
		statics : {
			regExp : function(reg, content) {
				return new RegExp(reg).test(content);
			},
			//是否是特殊字符
			isSpecialCharacter:function(character){
			   var reg = "[`~!@#\$%\^&\*\(\)_\+<>\?:\"{},\.\/;'\[\\]]";
			   return this.regExp(reg,character);
			},
			isImg : function(imgpath) {
				if (typeof imgpath === 'undefined' || null == imgpath) {
					return false;
				}
				var allow = [ 'jpg', 'png', 'jpeg', 'gif' ], suffix = imgpath.substring(imgpath.lastIndexOf("\.") + 1);
				return Hoo.util.Array.contains(allow, suffix);
			},
			isEmail : function(email) {
				var reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
				return reg.test(email);
			},
			isMobile : function(mob) {
				var reg = /^(13|14|15|17|18)[0-9]{9}$/;
				return reg.test(mob);
			},
			isPhone : function(phone) {
				var withArea = /^[0][1-9]{2,3}-[0-9]{5,10}$/, noArea = /^[1-9]{1}[0-9]{5,8}$/;
				if (phone.length > 9) {
					return withArea.test(phone);
				} else {
					return noArea.test(phone);
				}
			},
			isCardId : function(cardid) {
				var reg = /^[0-9]{17}[0-9A-Za-z]{1}$|^[0-9]{14}[0-9A-Za-z]{1}$/;
				return reg.test(cardid);
			},
			isNum : function(num) {
				var re = new RegExp("^[0-9]+$");
				return ('' + num).search(re) != -1;
			},
			isFloat : function(oNum) {
				var strP = /^\d+(\.\d+)?$/;
				if (!strP.test(oNum)) { return false; }
				try {
					if (parseFloat(oNum) != oNum) { return false; }
				} catch (ex) { return false; }
				return true;
			},
			isFunction : function(fn) {
				return (!!fn && !fn.nodename && fn.constructor != String && fn.constructor != RegExp && fn.constructor != Array && /function/i.test(fn + ""));
			},
			isArray : function(v) {
				return toString.apply(v) === '[object Array]';
			},
			isObject : function(obj) {
				return typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
			}
		}
	});
})();
/**
 * 字符串加密、解密处理函数
 * [算法取自互联网,已校验通过]
 */
(function() {

	Hoo.define("Hoo.util.Encode", {
		statics : {
		    toNum   : function(str){
				var out = '';
				str = escape(str);
				for(var i=0,len = str.length; i < len; i++){
					out += str.charCodeAt(i) - 23;
				}
				return out;
		    },
		    toStr   : function(num){
		    	var out = '',_in;
		    	for(var i = 0,len = num.length;i < len;i += 2){
		    		_in = parseInt(num.substr(i,[2])) + 23;
		    		_in = unescape('%' + _in.toString(16));
		    		out += _in;
		    	}
		    	return unescape(out);
		    },
			/**
			 * 加密
			 */
			encrypt : function(str, pwd) {
				if (str == '') { return ''; }
				str = encodeURIComponent(str);
				if (!pwd || pwd == '') { pwd = 'abc123!@$'; }
				pwd = encodeURIComponent(pwd);
				if (pwd == '' || pwd.length <= 0) { return ''; }
				var prand = '';
				for ( var i = 0, len = pwd.length; i < len; i += 1) {
					prand += pwd.charCodeAt(i).toString();
				}
				var sPos = Math.floor(prand.length / 5);
				var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2)
						+ prand.charAt(sPos * 3) + prand.charAt(sPos * 4)
						+ prand.charAt(sPos * 5));
				var incr = Math.ceil(pwd.length / 2);
				var modu = Math.pow(2, 31) - 1;
				if (mult < 2) {
					return '';
				}
				var salt = Math.round(Math.random() * 1000000000) % 100000000;
				prand += salt;
				while (prand.length > 10) {
					prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
				}
				prand = (mult * prand + incr) % modu;
				var encChr = '';
				var encStr = '';
				for ( var i = 0, len = str.length; i < len; i += 1) {
					encChr = parseInt(str.charCodeAt(i)
							^ Math.floor((prand / modu) * 255));
					if (encChr < 16) {
						encStr += '0' + encChr.toString(16);
					} else {
						encStr += encChr.toString(16);
					}
					prand = (mult * prand + incr) % modu;
				}
				salt = salt.toString(16);
				while (salt.length < 8) {
					salt = "0" + salt;
				}
				encStr += salt;
				return encStr;
			},
			/**
			 * 解密
			 */
			decrypt : function(str, pwd) {
				if (str == '') { return ''; }
				if (!pwd || pwd == '') { pwd = pwd = 'abc123!@$'; }
				pwd = encodeURIComponent(pwd);
				if (str == undefined || str.length < 8) { return ''; }
				if (pwd == undefined || pwd.length <= 0) { return ''; }
				var prand = '';
				for ( var i = 0, len = pwd.length; i < len; i += 1) {
					prand += pwd.charCodeAt(i).toString();
				}
				var sPos = Math.floor(prand.length / 5);
				var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2)
						+ prand.charAt(sPos * 3) + prand.charAt(sPos * 4)
						+ prand.charAt(sPos * 5));
				var incr = Math.round(pwd.length / 2);
				var modu = Math.pow(2, 31) - 1;
				var salt = parseInt(str.substring(str.length - 8, str.length),16);
				str = str.substring(0, str.length - 8);
				prand += salt;
				while (prand.length > 10) {
					prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
				}
				prand = (mult * prand + incr) % modu;
				var encChr = '';
				var encStr = '';
				for ( var i = 0, len = str.length; i < len; i += 2) {
					encChr = parseInt(parseInt(str.substring(i, i + 2), 16)
							^ Math.floor((prand / modu) * 255));
					encStr += String.fromCharCode(encChr);
					prand = (mult * prand + incr) % modu;
				}
				return decodeURIComponent(encStr);
			}
		}
	});
})();
/**
 * store数据源,这里ajax请求,依赖于bridge模块
 */
Hoo.define('Hoo.data.Store',{
	extend : 'Hoo.Base',
	url    : '',
	params : {},
	autoLoad : false,
	dataProperty: 'data',
	cache  : false,
	getLoadStatus : function(){
		return this._loadStatus;
	},
	inited   : function(){
		var me = this;
		me.addEvents('beforload','afterload');
		me.callParent.apply(this,arguments);
	    me._loadStatus = 'unload'; // unload loading loaded 
		if(me.url != '' && me.autoLoad){ me.load(); }
		
	},
	load:function(){
		var me = this;
		if(me._loadStatus != 'unload'){ return;} 
		me._loadStatus = 'loading';
		
		me.fireEvent('beforload',me.params);
		
		var key = Hoo.util.Encode.toNum(me.url + JSON.stringify(me.params));
			map = Hoo.bridge.net.http.__cache_;
		if(me.cache && map[key]){
			me._loadStatus = 'loaded';
			me.fireEvent('afterload',map[key]);
			return;
		}
		
		Hoo.bridge.net.http.post({
			url    : me.url,
			params : me.params,
			success: function(result){
				me._loadStatus = 'loaded';
				me.fireEvent('afterload',result[me.dataProperty]);
				//如果数据属性为null 或者空数组,则可以重新调用load方法
				if(result[me.dataProperty] == null || result[me.dataProperty].length == 0){
					me._loadStatus = 'unload';
				}else{
					if(me.cache){ map[key] = result[me.dataProperty]; }
				}
			},
			fail   : function(status,msg){
				me._loadStatus = 'loaded';
			}
		});
	}
});/**
 * 仿IOS的 pickerView 这里仅用于视图的创建和显示
 * @memberOf {TypeName} 
 */
Hoo.define('Hoo.widget.PickerView',{
	extend   : 'Hoo.Base',
	renderTo : null,
	data     : [],
	displayField : 'name',
	valueField   : 'value',
	pickerId : null,
	sure     : '确定',
	cancel   : '取消',
	title    : '&nbsp;',
	value    : null,
	rawValue : null,
	autoShow : true,
	inited   : function(){
		this.addEvents('valueChange');	
		this.callParent.apply(this,arguments);
	
		this.pickerId = this.pickerId == null ? Hoo.getId('picker_') : this.pickerId;
		this.renderTo = this.renderTo == null ? document.body : this.renderTo;
		
		this._scrollId= Hoo.getId('iscroll_');
		this._builderPickerView();
		this._bindListeners();
		this._bindScroll();
		this._initData();
	},
	_values   : null,
	_scrollId : null,
	_bindListeners:function(){
		var me = this;
		$('#' + me.pickerId + ' .sure').unbind('click').bind('click',function(){
			var ele = me._values;
			if(Hoo.util.Object.isObject(ele)){
       	 		me.value    = ele[me.valueField];
       	 		me.rawValue = ele[me.displayField];
       	 	}else{
       	 		me.value = me.rawValue = ele;
       	 	}
			me.fireEvent('valueChange',me,me.value,me.rawValue);
			me.hide();
		});
		$('#' + me.pickerId + ' .cancel').unbind('click').bind('click',function(){
			me.hide();
		});
	},
	_bindScroll:function(){
		var me = this;
		me._scroll = new iScroll(me._scrollId,{
			snap       : "li",
			vScrollbar : false,
	        onScrollEnd: function () {
           	 	var index = Math.round(this.y/(-3.2*16));
           	 	me._values = me.data[index];
            }
		});
	},
	_builderPickerView:function(){
		var me = this,tpl = '<div id="{pickerId}" class="hoo-picker-mask"><div class="hoo-picker"><div class="hoo-picker-toolbar"><div class="cancel">{cancel}</div><div class="sure">{sure}</div><div class="title">{title}</div><div class="selected-line"></div></div><div class="main" id="{iscrollWraperId}"><ul></ul></div></div></div>'
		me._get$Ele().append(Hoo.util.String.format2(tpl,{
        	iscrollWraperId : me._scrollId,
        	pickerId        : me.pickerId,
        	sure   : me.sure,
        	cancel : me.cancel,
        	title  : '&nbsp;'
        }));
	},
	_initData: function(){
		var me = this;
		$('#' + me._scrollId + ' ul').html(me._getULHTML(me.data));
		me._scroll.refresh();
		if(me.data.length > 0){
			var ele,v,index = -1;
			for(var i=0,len = me.data.length;i<len;i++){
				ele = me.data[i];
				if(Hoo.util.Object.isObject(ele)){ v = ele[me.valueField]; }else{ v = ele; }
				if(v === me.value){
					index = i; break;
				}
			}
			//如果已被赋值
			if(me.value != null && index != -1){
				var ele = me.data[i];
       	 		me.rawValue = Hoo.util.Object.isObject(ele) ? ele[me.displayField] : ele;
				me.fireEvent('valueChange',me,me.value,me.rawValue);
			}
			if(me.value == null || index == -1){ index = 0;}
			me._scroll.scrollToElement('li:nth-child('+ (index+1) +')', 10);
		}else{
			me.value = me.rawValue = null;
		}
		
		var $picker = $('#' + me.pickerId);
		if(me.autoShow){ $picker.show(); }else{ $picker.hide(); }
	},
	_get$Ele : function(){
		var me = this,$ele = me.renderTo;
		if(Hoo.util.Object.isDOM(me.renderTo)){
			$ele = $(me.renderTo);
		}else if(Hoo.util.Object.isString(me.renderTo)){
			$ele = $('#' + me.renderTo);
		}
		return $ele;
	},
	_scroll   : null,
	_getULHTML: function(data){
		var me = this,html = '',ele;
    	for(var i=0,len = data.length;i<len;i++){
    		if(i == 0){ html += '<li>&nbsp;</li>';}
    		ele = data[i];
    		if(Hoo.util.Object.isObject(ele)){
    			html += ('<li>'+ ele[me.displayField] + '</li>');
    		}else{
    			html += ('<li>'+ ele + '</li>');
    		}
    		if(i == len - 1){ html += '<li>&nbsp;</li>';}
    	}
    	return html;
	},
	loadData:function(data){
		this.data = data;
		this._initData();
	},
	show : function(){
		$('#' + this.pickerId).show();
	},
	hide : function(){
		$('#' + this.pickerId).hide();
	},
	setTitle : function(title){
		var me = this;
		if(typeof title == 'undefined' || '' == title || null == title){
			title = '&nbsp';
		}
		me.title = title;
		$('#' + me.pickerId + ' .title').html(me.title);
	},
	getValue : function(){
		return this.value;
	},
	getRawValue:function(){
	    return this.rawValue;
	},
	destory:function(){
		var me = this;
		me._scroll.destroy();
		me._scroll = null;
		$('#' + me.pickerId).remove();
	}
});/**
 * 用于DatePicker(日期选择器)的构建
 * [delte -->当前构建方式更加合理,是PickerView的升级(后续会更正PickerView以及plugs中不合理的地方)]
 * @date 2016.06.23 11:28
 * 
 */
Hoo.define('Hoo.widget.DatePicker',{
	extend  : 'Hoo.widget.PickerView',
	startYear : 1900,
	yearLength: 150,
	/*minDate : null,
	maxDate : null,*/
	/**
	 * model 支持[*]其余根据实际需要扩展含ap等方式的,建议format 自定义处理
	 * 
	 * date        年月日(默认)[*]
	 * year        年[*]
	 * yearmonth   年月[*]
	 * year-ap     年 上/下半年[*]
	 * date-ap     年月日 上/下半天[*]
	 * datetime    年月日 时分[*]
	 * datetime-m  年月日 时分秒
	 * 
	 * 
	 */
	model   : 'date',
	/**
	 * 格式化
	 * 需与model匹配
	 */
	format  : 'yyyy-MM-dd',
	/**
	 * 分 间隔,需被60整除
	 */
	seconedInterval   : 5,
	ap        :[{label:'上半天',value:'A'},{label:'下半天',value:'P'}],
	apy       :[{label:'上半年',value:'A'},{label:'下半年',value:'P'}],
	speed     : 2,
	inited    : function(){
		this._value = {};
		this._scrollIdMap = {};
		this.callParent.apply(this,arguments);
	   //关于时间的长短问题,暂不处理
	},
	_monthDays:[31,28,31,30,31,30,31,31,30,31,30,31],
	_modelMap :{
		year     : ['year'],
		'year-ap': ['year','apy'],
		yearmonth: ['year','month'],
		date     : ['year','month','day'],
		'date-ap': ['year','month','day','ap'],
		datetime : ['year','month','day','hour','minute']
	},
	_builderPickerView: function(){
		
		var me = this,cells = me._modelMap[me.model],childHtml = '';
		if(typeof cells === 'undefined'){ return; }
		
		for(var i=0,len = cells.length;i<len;i++){
			me._scrollIdMap[cells[i]]= Hoo.getId('iscroll_');
			childHtml += ('<div class="raw-cell" id="{'+ cells[i] +'}"><ul></ul></div>');
		}
		
		var tpl = '<div id="{pickerId}" class="hoo-picker-mask"><div class="hoo-picker"><div class="hoo-picker-toolbar"><div class="cancel">{cancel}</div><div class="sure">{sure}</div><div class="title">{title}</div><div class="selected-line"></div></div>' +
		'<div class="main">' + childHtml + '</div></div></div>',
		   tplOpt = {
	        	pickerId: me.pickerId,
	        	sure    : me.sure,
	        	cancel  : me.cancel,
	        	title   : '&nbsp;'
	        };
		for(var key in me._scrollIdMap){
			tplOpt[key] = me._scrollIdMap[key];
		}
		
		me._get$Ele().append(Hoo.util.String.format2(tpl,tplOpt));
		
		$('#' + me.pickerId + ' .main').css({display:'flex'}).children().css({
			width : (100/$('#' + me.pickerId + ' .main').children().length)+'%'
		});
	},
	_bindListeners    : function(){
		this.callParent.apply(this,arguments);
		var me = this;
		$('#' + me.pickerId + ' .sure').unbind('click').bind('click',function(){
			if(me.model == 'year' || me.model == 'yearmonth' || me.model == 'date' || me.model == 'datetime'){
				var year = me._value['year'],
				   month = me._value['month'] || 1,
				     day = me._value['day']   || 1,
				    hour = me._value['hour']  || 0,
				  minute = me._value['minute']|| 0,
				  date   = new Date(year,month -1 ,day,hour,minute,0);
				if(Hoo.util.Object.isString(me.format)){
					me.rawValue = Hoo.util.Date.format(date,me.format);
				}else if(Hoo.util.Object.isFunction(me.format)){
					me.rawValue = me.format.call(me,me._value)
				}
				me.value = date;
			}
			me.fireEvent('valueChange',me,me.value,me.rawValue);
			me.hide();
		});
	},
	_bindScroll       : function(){
		var me = this;
		me._scrollMap = {};
		for(var key in me._scrollIdMap){
			(function(k,self){
				var me = self,id = me._scrollIdMap[k];
				me._scrollMap[k]  = new iScroll(id,{
					snap       : "li",
					vScrollbar : false,
			        onScrollEnd: function () {
		           	 	var index = Math.round(this.y/(-3.2*16)) + 1;//TODO 因为所有HTML的ul下li元素,均多出首尾两个空li
		           	 	me._value[k] = $('#' + id + ' li:eq('+index+')').html();
		           	 	if(me.model === 'year-ap'){
		           	 		if(k === 'apy'){ me._value[k] = me.ap[index - 1]['value']; }
		           	 	}else if(me.model === 'date' || me.model === 'date-ap' || me.model == 'datetime'){
		           	 		if(k === 'ap'){ me._value[k] = me.ap[index - 1]['value']; }
		           	 		//TODO bug: 当多个日历picker时,me._value发生混乱[解决:inited方法内重置_values,具体引发原因应该在core.js里]
		           	 		if(k === 'year' || k === 'month' ){
		           	 			var year = parseInt(me._value['year']),
		           	 			   month = parseInt(me._value['month'] || '1'),
		           	 			     day = parseInt(me._value['day'] || '0');
		           	 			var maxDay = me._monthDays[month - 1];
		           	 			if(month == 2 ){ 
		           	 				if(Hoo.util.Date.isLeapYear(year)){ maxDay = 29; }else{ maxDay = 28;}
		           	 				me._monthDays[month -1] = maxDay;
		           	 			}
		           	 			if(day > maxDay){ me._value['day'] = maxDay; }
	           	 				if(typeof me._value['day'] !== 'undefined'){
	           	 					me._refreshDay();
	           	 				}
		           	 		}
		           	 	}
		            }
				});
			})(key,me);
		}
		
	},
	_initData:function(){
		var me = this;
		if(me.model === 'year')     { me._refreshYear(); }
		if(me.model === 'year-ap')  { me._refreshYear(); me._refreshAPY();}
		
		if(me.model === 'yearmonth'){ me._refreshYear();me._refreshMonth(); }
		if(me.model === 'date')     { me._refreshYear();me._refreshMonth();me._refreshDay(); }
		if(me.model === 'date-ap')  { me._refreshYear();me._refreshMonth();me._refreshDay();me._refreshAP();}
		if(me.model === 'datetime') { me._refreshYear();me._refreshMonth();me._refreshDay();me._refreshHour();me._refreshMminute(); }
	
		var $picker = $('#' + me.pickerId);
		if(me.autoShow){ $picker.show(); }else{ $picker.hide(); }
	},
	_refreshYear  : function(){
		var me = this,scrollId = me._scrollIdMap[me._modelMap[me.model][0]];
		$('#' + scrollId + ' ul:eq(0)').html(me._getYearHtml());
		me._scrollMap[me._modelMap[me.model][0]].refresh();
		var year = me._value['year'],index;
		year  = typeof year === 'undefined' ? (new Date()).getFullYear() : parseInt(year);
		index = year - me.startYear + 1;
		if(index < 1 || index > me.yearLength){ index =1; }
		me._scrollMap[me._modelMap[me.model][0]].scrollToElement('li:nth-child('+ index +')', me.speed);
	},
	_refreshMonth: function(){
		var me = this;
		$('#' + me._scrollIdMap[me._modelMap[me.model][1]] + ' ul:eq(0)').html(me._getMonthHtml());
		me._scrollMap[me._modelMap[me.model][1]].refresh();
		var month = me._value['month'];
		    month =(typeof month === 'undefined') ? ((new Date()).getMonth() + 1) : parseInt(month);
		me._scrollMap[me._modelMap[me.model][1]].scrollToElement('li:nth-child('+ month +')', me.speed);
	},
	_refreshDay  : function(){
		var me = this;
		$('#' + me._scrollIdMap[me._modelMap[me.model][2]] + ' ul:eq(0)').html(me._getDayHtml());
		me._scrollMap[me._modelMap[me.model][2]].refresh();
		var day = me._value['day'];
			day = (typeof day === 'undefined') ? (new Date()).getDate() : parseInt(day);
		me._scrollMap[me._modelMap[me.model][2]].scrollToElement('li:nth-child('+ day +')', me.speed);
	},
	_refreshHour : function(){
		var me = this;
		$('#' + me._scrollIdMap[me._modelMap[me.model][3]] + ' ul:eq(0)').html(me._getHourHtml());
		me._scrollMap[me._modelMap[me.model][3]].refresh();
		var hour = me._value['hour'];
			hour = (typeof hour === 'undefined') ? ((new Date()).getHours() + 1): parseInt(hour);
		me._scrollMap[me._modelMap[me.model][3]].scrollToElement('li:nth-child('+ hour +')', me.speed);
	},
	_refreshMminute:function(){
		var me = this;
		$('#' + me._scrollIdMap[me._modelMap[me.model][4]] + ' ul:eq(0)').html(me._getMinuteHtml());
		me._scrollMap[me._modelMap[me.model][4]].refresh();
		var minute = me._value['minute'],index;
			minute = (typeof minute === 'undefined') ? ((new Date()).getMinutes()): parseInt(minute);
			index  = (parseInt(minute/me.seconedInterval) + 1 );
		me._scrollMap[me._modelMap[me.model][4]].scrollToElement('li:nth-child('+ index +')', me.speed);
	},
	_refreshAP:function(){
		var me = this;
		$('#' + me._scrollIdMap[me._modelMap[me.model][3]] + ' ul:eq(0)').html(me._getAPHtml());
		me._scrollMap[me._modelMap[me.model][3]].refresh();
		var ap = me._value['ap'],index = -1;
		if(typeof ap === 'undefined'){
			index = 1;
		}else{
			for(var i = 0,len = me.ap.length;i<len;i++){
				if(me.ap[i]['value'] === ap){ index = i+1; break;}
			}
		}
		if(index != -1){me._scrollMap[me._modelMap[me.model][3]].scrollToElement('li:nth-child('+ index +')', me.speed);}
	},
	_refreshAPY  : function(){
		var me = this;
		$('#' + me._scrollIdMap[me._modelMap[me.model][1]] + ' ul:eq(0)').html(me._getAPYHtml());
		me._scrollMap[me._modelMap[me.model][1]].refresh();
		var apy = me._value['apy'],index = -1;
		if(typeof apy === 'undefined'){
			index = 1;
		}else{
			for(var i = 0,len = me.apy.length;i<len;i++){
				if(me.apy[i]['value'] === apy){ index = i+1; break;}
			}
		}
		if(index != -1){me._scrollMap[me._modelMap[me.model][1]].scrollToElement('li:nth-child('+ index +')', me.speed);}
	},
	_getYearHtml : function(){
		var me = this,html = '';
		for(var i= me.startYear,len = me.startYear + me.yearLength + 1;i<len;i++){
			if(i == me.startYear){ html += '<li>&nbsp;</li>';}
			html += ('<li>'+ i +'</li>');
			if(i == len - 1){ html += '<li>&nbsp;</li>';}
		}
		return html;
	},
	_getMonthHtml: function(){
		var html = '';
		for(var i=0,len = 12;i<len;i++){
			if(i == 0){ html += '<li>&nbsp;</li>';}
			html += ('<li>'+ (i+1) +'</li>');
			if(i == len - 1){ html += '<li>&nbsp;</li>';}
		}
		return html;
	},
	_getDayHtml  : function(){
		var me = this,html = '',month = me._value['month'] || ( (new Date()).getMonth() + 1);//默认当前月
		for(var i=0,len = me._monthDays[month - 1];i<len;i++){
			if(i == 0){ html += '<li>&nbsp;</li>';}
			html += ('<li>'+ (i+1) +'</li>');
			if(i == len - 1){ html += '<li>&nbsp;</li>';}
		}
		return html;
	},
	_getHourHtml : function(){
		var html = '',hour;
		for(var i=0,len = 24;i<len;i++){
			if(i == 0){ html += '<li>&nbsp;</li>';}
			hour = i < 10 ? ('0' + i) : i;
			html += ('<li>'+ hour +'</li>');
			if(i == len - 1){ html += '<li>&nbsp;</li>';}
		}
		return html;
	},
	_getMinuteHtml:function(){
		var html = '',minute,me = this;
		for(var i=0,len = 60/me.seconedInterval;i<len;i++){
			if(i == 0){ html += '<li>&nbsp;</li>';}
			minute = me.seconedInterval * i < 10 ? ('0' + me.seconedInterval * i) : me.seconedInterval * i;
			html += ('<li>'+ minute +'</li>');
			if(i == len - 1){ html += '<li>&nbsp;</li>';}
		}
		return html;
	},
	_getAPHtml   : function(){
		var html = '',me = this;
		for(var i=0,len = me.ap.length;i<len;i++){
			if(i == 0){ html += '<li>&nbsp;</li>';}
			html += ('<li>'+ me.ap[i]['label'] +'</li>');
			if(i == len - 1){ html += '<li>&nbsp;</li>';}
		}
		return html;
	},
	_getAPYHtml:function(){
		var html = '',me = this;
		for(var i=0,len = me.apy.length;i<len;i++){
			if(i == 0){ html += '<li>&nbsp;</li>';}
			html += ('<li>'+ me.apy[i]['label'] +'</li>');
			if(i == len - 1){ html += '<li>&nbsp;</li>';}
		}
		return html;
	},
	destory:function(){
		var me = this,scroll;
		for(var key in me._scrollMap){
			scroll = me._scrollMap[key];
			scroll.destroy();
			scroll = null;
		}
		me._scrollMap = {};
		$('#' + me.pickerId).remove();
	},
	//datePicker下暂不生效
	loadData:function(){}
});/**
 * field基类
 * @return {TypeName} 
 */
Hoo.define('Hoo.plugs.field.BaseField',{
	extend : 'Hoo.Base',
	label  : ''  ,
	name   : null,
	value  : null,
	maxLength : -1,
	format : null,
	allowBlank : true,
	blankText: '该字段不可为空.',
	mutexFieldName:'',//互斥字段名
	mutexMsg : '',    //互斥提示消息
	_xtype   : null,
	//当前框架不参与UI创建,所以被选择的DOM元素,由外部指定,
	//另外该框架耦合$,所以均指定为$对象.[暂不启用]
	$selector : null,
	validate : function(){
		var me = this;
		if(!me.allowBlank && me.value == null || '' == me.value){
			me.fireEvent('validateFail',me.blankText); return false;
		}
		
		//为自定义validate事件
		var res = me.fireEvent('validate',{
			name  : me.name  ,
			value : me.value ,
			format: me.format
		});
		if(res){ return false; }
		me.fireEvent('validateSuccess',me);
		return true;
	},
	setValue:function(value){
		var me = this;
		me.value = value;
		me.fireEvent('valueChange',me,value);
		me.validate();
	},
	getValue:function(){
		return this.value;
	},
	getName:function(){
		return this.name;
	},
	getType:function(){
		return this._xtype;
	},
	destroy :function(){},
	inited : function(){
		this.addEvents('validate','validateFail','validateSuccess','valueChange');
		this.callParent.apply(this,arguments);
	}
});Hoo.define('Hoo.plugs.field.TextField',{
	extend : 'Hoo.plugs.field.BaseField',
	_xtype : 'text'
});Hoo.define('Hoo.plugs.field.EmailField',{
	extend : 'Hoo.plugs.field.BaseField',
	_xtype : 'email',
	validate : function(){
		var me = this;
		if(!me.allowBlank && me.value == null || '' == me.value){
			me.fireEvent('validateFail',me.blankText); return false;
		}
		if(!Hoo.util.Validate.isEmail(me.value)){
			me.fireEvent('validateFail','请输入正确的邮箱地址.'); return false;
		}
		
		//为自定义validate事件
		var res = me.fireEvent('validate',{
			name  : me.name  ,
			value : me.value ,
			format: me.format
		});
		if(res){ return false; }
		me.fireEvent('validateSuccess',me);
		return true;
	}
});Hoo.define('Hoo.plugs.field.MobileField',{
	extend : 'Hoo.plugs.field.BaseField',
	_xtype : 'mobile',
	validate : function(){
		var me = this;
		if(!me.allowBlank && me.value == null || '' == me.value){
			me.fireEvent('validateFail',me.blankText); return false;
		}
		if(!Hoo.util.Validate.isMobile(me.value)){
			me.fireEvent('validateFail','请输入正确的移动手机号.'); return false;
		}
		//为自定义validate事件
		var res = me.fireEvent('validate',{
			name  : me.name  ,
			value : me.value ,
			format: me.format
		});
		if(res){ return false; }
		me.fireEvent('validateSuccess',me);
		return true;
	}
});Hoo.define('Hoo.plugs.field.NumberField',{
	extend : 'Hoo.plugs.field.BaseField',
	_xtype : 'mobile',
	validate : function(){
		var me = this;
		if(!me.allowBlank && me.value == null || '' == me.value){
			me.fireEvent('validateFail',me.blankText); return false;
		}
		if(!Hoo.util.Validate.isFloat(me.value)){
			me.fireEvent('validateFail','请输入正确的数字.'); return false;
		}
		//为自定义validate事件
		var res = me.fireEvent('validate',{
			name  : me.name  ,
			value : me.value ,
			format: me.format
		});
		if(res){ return false; }
		me.fireEvent('validateSuccess',me);
		return true;
	}
});/**
 * picker基类
 * @return {TypeName}
 */
Hoo.define('Hoo.plugs.field.BasePicker',{
	extend : 'Hoo.plugs.field.BaseField',
	_picker : null,
	rawValue : null,
	getRawValue:function(){
		return this.rawValue;
	},
	setRawValue : function(rawValue){
		this.rawValue = rawValue;
	},
	inited : function(){
		this.addEvents('beforeSelect','selected','change');
		this.callParent.apply(this,arguments);
	},
	show : function(){
		if(null != this._picker){ this._picker.show(); }
	},
	hide : function(){
		if(null != this._picker){ this._picker.hide(); }
	},
	destroy:function(){
		if(null != this._picker){ this._picker.destory(); }
	}
});Hoo.define('Hoo.plugs.field.SelectPicker',{
	extend : 'Hoo.plugs.field.BasePicker',
	_xtype : 'select',
	model  : 'local',
	valueField  : 'value',
	displayField: 'name',
	store  : null,
	inited : function(){
		var me = this;
		me.addEvents('select');
		me.callParent.apply(me,arguments);
		me.data = [];
		if(me.model == 'remote' && me.store != null){
			if(!me.store.$isClass && Hoo.util.Object.isObject(me.store)){
				me.store = Hoo.create('Hoo.data.Store',me.store);
			}
			me.store.on('afterload',function(datas){
				me.data = datas;
				me._picker = Hoo.create('Hoo.widget.PickerView',{
					 value    : me.value
		    		, data     : datas
		    		,autoShow : false
		    		,displayField : me.displayField
					,valueField   : me.valueField
					,listeners :{
						valueChange :function(picker,value,rawValue){
							me.value    = value;
							me.rawValue = rawValue;
							me.fireEvent('select',picker,value,rawValue);
						}
					}
		    	});
				
				if(me.value != null){ me.setValue(me.value); }
			});
			me.store.load();
		}else{
			if(me.value != null){ me.setValue(me.value); }
		}
	},
	setValue : function(value){
		var ele,me = this,v;
		if(me.model == 'remote' && me.store.getLoadStatus() != 'loaded' && me.data.length == 0){
			me.value = value;
		}else{
			me.value = null;
		}
		for(var i=0,len = me.data.length;i<len;i++){
			ele = me.data[i];
			if(Hoo.util.Object.isObject(ele)){ 
				v = ele[me.valueField];
			}else{
				v = ele;
			}
			if(v === value){ 
				if(Hoo.util.Object.isObject(ele)){
					me.rawValue = ele[me.displayField];
				}else{
					me.rawValue = v;
				}
				me.value = v; 
				me.fireEvent('change',me,me.value,me.rawValue);
				if(me._picker != null){
					
				}
				break;
			}
		}
	},
	setRawValue : function(rawValue){
		var ele,me = this,rv;
		for(var i=0,len = me.data.length;i<len;i++){
			ele = me.data[i];
			if(Hoo.util.Object.isObject(ele)){ 
				rv = ele[me.displayField];
			}else{
				rv = ele;
			}
			if(rv === rawValue){ 
				if(Hoo.util.Object.isObject(ele)){
					me.value = ele[me.valueField];
				}else{
					me.value = rv;
				}
				me.rawValue = rv; 
				me.fireEvent('change',me,me.value,me.rawValue);
				break;
			}
		}
	}
});Hoo.define('Hoo.plugs.field.DatePicker',{
	extend : 'Hoo.plugs.field.BasePicker',
	_xtype : 'date',
	//model : 'date', //year yearmonth
	//TODO 这里的value均与DatePciker保持一致,默认都是Date类型
	format : 'yyyy-MM-dd',
	inited : function(){
		var me = this;
		me.addEvents('select');
		me.callParent.apply(me,arguments);
		
		if(me.value != null){ me.setValue(me.value); }
		me._picker = Hoo.create('Hoo.widget.DatePicker',{
			 model  : 'date'
			,format : me.format
			,autoShow : false
			,listeners :{
				valueChange :function(picker,value,rawValue){
					me.setValue(value);
					me.fireEvent('select',picker,value,rawValue);
				}
			}
		});
		
	},
	setValue : function(value){
		var me = this;
		me.value = Hoo.util.Date.getDate(value);
		if(me.value != null){
			me.rawValue = Hoo.util.Date.format(me.value,me.format);
		}else{
			me.rawValue = null;
		}
		me.fireEvent('change',me,me.value,me.rawValue);
	},
	setRawValue:function(rawValue){
		var me = this;
		if(typeof rawValue == 'undefined' || Hoo.util.Object.isEmpty(rawValue)){
			me.value = me.rawValue = null;
		}else{
			me.setValue(Hoo.util.Date.getDate(rawValue));
		}
		me.fireEvent('change',me,me.value,me.rawValue);
	}
});Hoo.define('Hoo.plugs.field.DateTimePicker',{
	extend : 'Hoo.plugs.field.DatePicker',
	_xtype : 'datetime',
	format : 'yyyy-MM-dd hh:ii',
	inited : function(){
		var me = this;
		me.addEvents('select');
		me.callParent.apply(me,arguments);
		
		if(me.value != null){ me.setValue(me.value); }
		me._picker = Hoo.create('Hoo.widget.DatePicker',{
			 model  : 'datetime'
			,format : me.format
			,autoShow : false
			,listeners :{
				valueChange :function(picker,value,rawValue){
					me.setValue(value);
					me.fireEvent('select',picker,value,rawValue);
				}
			}
		});
		
	}
});/**
 * form 控制 相关的插件[ 使用 $ 控制 , 但引入在Hoo 中]
 */
Hoo.define('Hoo.plugs.Form',{
	extend : 'Hoo.Base',
	fields : [], 
	//{name:'',value:'',allowBlank:true,xtype:'text'}
	__filedMap:{
		 'text'  : 'Hoo.plugs.field.TextField'
	   ,'email'  : 'Hoo.plugs.field.EmailField'
      ,'number'  : 'Hoo.plugs.field.NumberField'
  //,'numberpicker': 'Hoo.plugs.field.NumberPicker'
	  ,'mobile'  : 'Hoo.plugs.field.MobileField'
		,'date'  : 'Hoo.plugs.field.DatePicker'
	  ,'datetime': 'Hoo.plugs.field.DateTimePicker'
		,'select': 'Hoo.plugs.field.SelectPicker'
	},
	inited:function(){
		var me = this;
		me._filedInstance = {};
		me.addEvents('beforeInstanceField');
		me.callParent.apply(me,arguments);
		var field,xtype;
		for(var i=0,len = me.fields.length;i<len;i++){
			field = me.fields[i];
			xtype = field['xtype'] || 'text';
			field['autoShow'] = false;
			me.fireEvent('beforeInstanceField',field);
			me._filedInstance[field['name']] = Hoo.create(me.__filedMap[xtype],field);
		}
	},
	isValidate : function(){
		var flag = true,instance;
		for(var name in this._filedInstance){
			instance = this._filedInstance[name];
			flag = instance.validate();
			if(!flag){ break; }
		}
		return flag;
	},
	reset : function(){
		for(var instance in this._filedInstance){
			this._filedInstance[instance].setValue(null);
		}
	},
	getValues : function(){
		var values = {},instance;
		for(var name in this._filedInstance){
			instance = this._filedInstance[name];
			if(instance.getType() == 'date'){
				values[name] = instance.getRawValue();
			}else{
				values[name] = instance.getValue();
			}
		}
		return values;
	},
	setValues : function(values){
		var instance;
		for(var name in this._filedInstance){
			instance = this._filedInstance[name];
			if(typeof values[name] !== 'undefined'){
				instance.setValue(values[name]);
			}
		}
	},
	getFieldByName:function(name){
		return this._filedInstance[name];
	},
	destroy:function(){
		var me = this,instance;
		for(var name in me._filedInstance){
			instance = me._filedInstance[name];
			instance.destroy();
			instance = null;
		}
		me._filedInstance = {};
	}
});(function(){
	
	Hoo.define("Hoo.plugs.Dialog",{
		statics : {
			_dialog:function(opts){
				var type = opts.type,id = null,div,$dialog,defaultOptions = {
						sureText  : '确定', title     : '提示', content   : '',isShowTitle : false,
						appendTo  : document.body, callback:function(){}
				};
				if('alert' == type){ 
					id = 'wui_widget_alert_id'; 
					div= '<div class="weui_dialog_alert" ><div class="weui_mask"></div> <div class="weui_dialog cdui_dialog" ><div class="weui_dialog_hd"><strong class="weui_dialog_title" data-name="title"></strong></div> <div class="weui_dialog_bd cdui_dialog_bd" data-name="content"></div><div class="weui_dialog_ft cdui_dialog_ft"><a href="javascript:;" class="weui_btn_dialog primary cdui_btn_dialog" data-name="sure"></a> </div></div></div>';
				}else if('confirm' == type){ 
					id ='wui_widget_confirm_id';
					div='<div class="weui_dialog_confirm"> <div class="weui_mask"></div> <div class="weui_dialog cdui_dialog"><div class="weui_dialog_hd"><strong class="weui_dialog_title" data-name="title"></strong></div> <div class="weui_dialog_bd cdui_dialog_bd" data-name="content"></div> <div class="weui_dialog_ft cdui_dialog_ft"><a href="javascript:;" class="weui_btn_dialog default cdui_btn_dialog" data-name="cancel"></a> <a href="javascript:;" class="weui_btn_dialog primary cdui_btn_dialog" data-name="sure" ></a> </div> </div> </div>';
					defaultOptions.cancelText = '取消';
					defaultOptions.cancel     = function(){};
				}
				for(var key in (opts || {})){ defaultOptions[key] = opts[key]; }
				
				if($){
					var $dialog = $(div);
					$dialog.appendTo(defaultOptions.appendTo);
					
					if(type == 'confirm'){
						$dialog.find('a[data-name="cancel"]').unbind('click').bind('click',function(){
							defaultOptions.callback.call(defaultOptions.scope || $dialog,false,$(this));
							$dialog.remove();
						});
						$dialog.find('a[data-name="cancel"]').html(defaultOptions.cancelText);
					}else if(type == 'alert'){
					}
					$dialog.find('a[data-name="sure"]').unbind('click').bind('click',function(){
						defaultOptions.callback.call(defaultOptions.scope || $dialog,true,$(this));
						$dialog.remove();
					});
					if(defaultOptions.isShowTitle){
						$dialog.find('strong[data-name="title"]').html(defaultOptions.title);
					}else{
						$dialog.find('strong[data-name="title"]').remove();
					}
					$dialog.find('div[class="weui_mask"]').css({'z-index':3});
					
					$dialog.find('div[data-name="content"]').css({color:'#000'}).html(defaultOptions.content);
					$dialog.find('a[data-name="sure"]').html(defaultOptions.sureText);
					
				}else{
					//暂时不支持 $ 外的方式	id
				}
			},
			alert : function(opts) {
				if(Hoo.util.Object.isString(opts)){
					opts = { content : opts };
					if(Hoo.util.Object.isFunction(arguments[1])){
						opts.callback = arguments[1];
					}
				}
				opts = opts || {}; opts.type = 'alert'; Hoo.plugs.Dialog._dialog(opts);
			},
			confirm : function(opts) {
				if(Hoo.util.Object.isString(opts)){
					opts = { content : opts };
					if(Hoo.util.Object.isFunction(arguments[1])){
						opts.callback = arguments[1];
					}
				}
				opts = opts || {}; opts.type = 'confirm'; Hoo.plugs.Dialog._dialog(opts);
			},
			/**
			 * 吐司
			 * @param {Object} opts
			 * {
			 * 	 content : '',
			 *   callback: function(){},
			 *   delay   : 2000
			 * }
			 */
			toast  : function(opts){
				//document.body
				if(Hoo.util.Object.isString(opts)){
					opts = { content : opts };
					if(Hoo.util.Object.isFunction(arguments[1])){
						opts.callback = arguments[1];
					}
					if(arguments[2] && Hoo.util.Validate.isNum(arguments[2])){
						opts.delay = arguments[2];
					}
				}
				var dfc = {content:'',callback:Hoo.emptyFn,delay:2000};
				Hoo.copyTo(opts,dfc);
				var $msg = $('<div class="plug-dialog-toast"><span>'+ dfc.content +'</span></div>');
				$msg.appendTo($('body')).css({
					left : (($('body').width() - $msg.find('span').width()) / 2 - 20)
				}).fadeIn(500).fadeOut(Math.abs(dfc.delay - 500),function(){
					$msg.remove();
					 dfc.callback();
				});
				
			}
		}
	});
	
})();/**
 * 桥接【抽象类】定义类
 */
(function(){
	
	Hoo.define("Hoo.bridge",{
		statics : {
			__configure : {
				basePath  : null, //基础访问路径
				relativeUrl : '', //相对地址[相对部署地址] basePath + relativeUrl = baseUrl
				bridgeName: null, //桥接对象名称
				css       : {}    //css映射关系
			},
			/**
			 * 用于获取桥接对象
			 * @param {Object} callback
			 * @param {Object} scope
			 * @memberOf {TypeName}
			 */
			onCreateBridge: function(callback,scope){
				if(this.__configure.bridgeName && Hoo.util.Object.isFunction(callback)){
					callback.call(scope||this,window[this.__configure.bridgeName]);
				}
			},
			requireCss    : function(res,absolutePath){
				if(Hoo.util.Object.isString(res)){ res = [res]; }
				var href = null;
				//可以仿照requirejs 的加载方式,对此处进行处理
				for(var i=0,len = res.length;i<len;i++){
					try {
						href = this.getConfigrue()['baseUrl'] + this.__configure['css'][res[i]];
						//如果是绝对路径
						if(absolutePath){
							href = this.getConfigrue()['baseUrl'] + res[i];
						}
						if(typeof href === 'undefined'){ continue; }
						var link = document.createElement("LINK");
						link.rel = 'stylesheet';
						link.type= 'text/css';
						link.href= href + (Hoo.util.String.endWith(href,'.css') ?  '' : '.css');
						link.charset = 'utf-8';
						document.head.appendChild(link);//head的坑,暂不处理
						//var typ=document.createAttribute('charset');
						//typ.nodeValue='utf-8';
						//link.attributes.setNamedItem(typ);
					} catch (e) {}
				}
			},
			/**
			 * 初始化配置[暂时不限制初始次数]
			 * @params {JSON} 
			 * {
			 * 	  basePath  : '基础路径[默认 : web下取当前访问地址的basePath;android下是file:///android_asset/,ios下暂不知]',
			 *    relativeUrl : '相对访问地址',
			 *    bridgeName：'桥接对象名称',
			 *    css       : {
			 * 		  weui : 'res/css/WeUI/weui_mini.css'
			 *    }
			 * }
			 */
			initConfigrue : function(opts){
				//if(this.__isInit_){ return; } this.__isInit_ = true;
				Hoo.copyTo(opts,this.__configure);
			},
			getConfigrue  : function(){
				this.__configure.baseUrl = this.__configure.basePath + this.__configure.relativeUrl + (Hoo.util.String.endWith(this.__configure.relativeUrl,'\/') ?'' : '/');
				return this.__configure;
			},
			/**
			 * 依赖$的自定义工具类集合
			 * @param {Object} opts
			 */
			c$     : {
				/**
				 * 这里如果是本地,则要求需跨域
				 * optioins = 
				 *     {
				 *       relativePath : '',//相对路径[web优先使用]
				 *       absolutePath : '',//相对的绝对路径[android优先使用]
				 *       id  : '',
				 *       appendTo : 'parentId',
				 *       callback : function(response,status,xhr){}
				 *     }
				 */
				load:function(options){
					//$.support.cors = true; $.mobile.allowCrossDomainPages = true;
					//id 可指定　不指定则默认生成唯一的一个 appendTo 不指定则不使用
					var id = options.id,src = options.relativePath || ('file:///android_asset/www/' + options.absolutePath);
					var $div = $('<div></div>').attr('id',id);
					if(options.appendTo){ $div.appendTo('#' + options.appendTo); }
					$div.load(src,function(){ options.callback.apply(arguments); });
					return $div;
				}
			},
			widget : {
				dialog : {
					/**
					 * alert
					 * @param {Object | String} opts
					 * {
					 *   title   : '',
					 *   content : '',
					 *   callback:function(flag){},
					 *   scope   : this
					 * }
					 * @param {Function} callback 当opts为String时可用
					 */
					alert  : function(opts){},
					/**
					 * confirm
					 * @param {Object | String} opts
					 * {
					 *   title   : '',
					 *   content : '',
					 *   callback:function(flag){},
					 *   scope   : this,
					 *   isShowTitle : true
					 * }
					 * @param {Function} callback 当opts为String时可用
					 */
					confirm: function(opts){},
					/**
					 * toast
					 * @param {Object | String} opts
					 * {
					 *   title   : '',
					 *   content : '',
					 *   callback:function(flag){},
					 *   scope   : this,
					 *   delay   : 1500
					 * }
					 */
					toast  : function(opts){}
				}
			},
			net    : {
				http : {
					__cache_     : {},
				    __configure_ : {
						postOpts : {
							showToast   : true,
							showLoading : false,
							loadingText : '数据加载中...'
						},
						onSessionLost : function(lastOpts){}
				    },
				    getConfigure : function(){
				    	return this.__configure_;
				    },
					/**
					 * 初始化请求配置参数【暂不启用】
					 * @param {Object} opts
					 * {
					 * 	  // post请求的扩展参数配置
					 *    postOpts : {
					 *      	showToast  : true,
					 *          showLoading: false,
					 *          loadingText: '加载中...'
					 *    },
					 *    //session丢失后,的处理回调
					 *    //lastOpts session丢失时最后一次请求
					 *    onSessionLost : function(lastOpts){
					 *    		
					 *    }
					 * }
					 */
				    initConfig : function(opts){
				    	Hoo.copyTo(opts,this.__configure_);
						/*onSessionLost : function(callback){*/
				    },
					/**
					 * 执行post请求
					 * 
					 * @param {Object} opts
					 * {
					 * 		basePath : '',
					 *      url      : '相对请求地址',
					 *      params   : {},
					 *      opts     : {
					 *      	showToast  : true,
					 *          showLoading: false,
					 *          loadingText: '加载中...'
					 * 		},
					 *      //当onChche返回true时【没想好做什么缓存策略！！】
					 *      onCache  : function(params){
					 *            return null;
					 *      },
					 * 		success  : function(result){},
					 *      fail     : function(status,errorMsg){}
					 * }
					 */
					post   : function(opts){},
					// type : file || base64  || mutils(?)
					upload : function(opts){}
				}
			},
			uri    : {
				/**
				 * 启动一个界面
				 * 需遵从以下约束:
				 * 1、iOS 
				 *    需自定义桥接接口 startViewController
				 * 2、android
				 *    需自定义桥接接口 startActivity(activityClassName,jsonParams)
				 *                    startFragment(activityClassName,fragmentClassName,jsonParams)
				 * 3、web
				 *    需自定义桥接接口 需调整 href 参数为绝对路径【相对路径不可靠】
				 * 
				 * 总结:
				 *    具体映射关系,需每个桥接实现者自己实现.
				 * 
				 * {
				 * 	key    : '', 
				 *  params : {}
				 *  action : ''
				 * }
				 */
				startPage : function(opts){
					
				},
				/**
				 * 界面跳转
				 * requestCode 场景下,web暂未实现通信,但需在backForResult中实现为:强制上一界面刷新
				 * 这里默认 地址 opts为字符串时  取值相当于absolutePath, 主要方便兼容 hybrid,参数取 basePath 即可
				 * 
				 * @param {Object | String} opts
				 * {
				 *    relativePath: ' HTML 路径',
				 *    absolutePath: '',
				 *    params      : {},
				 *    title       : '页面初始后标题[空值不处理]'
				 * 
				 *    //在需A\B页面交互的时候生效[这在WEB下不起作用,但需告知B,返回时必须强制刷新??]
				 *    //,requestCode : 0 ,callback    : function(requestCode,result){}
				 *  }
				 */
				href : function(opts){},
				/**
				 * 返回 
				 * @param {Boolean} force 是否强制 force 在web下不处理
				 */
				back : function(force){},
				reload	      : Hoo.emptyFn,
				/**
				 * 返回,并触发上一界面的requestCode对应监听
				 */
				backForResult : Hoo.emptyFn,
				/**
				 * 参数与href保持一致,不同点在于replace后没后退[缓存]
				 * @param {Object} opts
				 */
				replace:function(opts){}
			},
			util   : {
				file : {
					/**
					 * 判断文件本地是否存在[web可不具体实现]
					 * @param {Object} fileName 文件名[全路径]
					 * @param {Object} callback 回调
					 */
					exists : function(fileName,callback){}
				},
				localStorage : {
					/**
					 * 设置本地存储 
					 * @param {String} key
					 * @param {Object} value
					 */
					setItem : function(key,value){},
					/**
					 * 获取本地存储的值
					 * @param {Object | String}   key 存储的key
					 * {
					 *    key      : '',
					 *    callback : function(value){},
					 *    dfValue  : '',
					 *    scope    : this
					 * }
					 * @param {Function} callback 用于传递返回值的回调函数
					 * @param {Object}   dfValue 默认值[key未被存储或值为null / undefined 时]
					 * @param {Object}   scope 作用域
					 */
					getItem : function(key,callback,dfValue,scope){
						
					}
				},
				url  : {
					/**
					 * 获取当前浏览器地址下的参数
					 * 
					 * @param {Object}
					 * 
					 * @example
					 * 
					 * queryString : 
					 *      http://www.website.com?param1=value1&param2=v2
					 * getUrlParams({
					 * 	  //默认获取类型 为 ? 后的 参数 [暂不支持 #]
					 * 	  type    : '?',
					 * 	  //是否格式化JSON格式, 如果 key 不传递, 执行格式化则为 {param1:value1,param2:v2},如果传递则以对应值为准,默认null
					 *    format  : false,
					 *    //是否中文转换[如果参数包含中文,请置为true,否则乱码]
					 *    zh      : false,
					 *    //获取参数param1 的值,如果不填写,则获取 param1=value1&param2=v2
					 *    key     : 'param1',
					 *    // 获取的参数或 value
					 *    callback: function(result){
					 * 		//  result 结果 : value1
					 *    },
					 *    // 作用域
					 *    scope   : null
					 * });
					 * 
					 * 
					 */
					getUrlParams : function(opts){},
					/**
					 * 获取格式化后的QueryString 集合(值 需要自行格式化 @see getUrlParams 则可以自动格式化值)
					 * 
					 * @param {JSON | Array} opts
					 * @param {Function} callback
					 * @param {Boolean} zh
					 * 
					 * @example
					 * 
					 * queryString : 
					 * 		http://www.website.com?param1=value1&param2=v2
					 * 
					 * 1、
					 * 	formatQueryString({
					 * 	    params : ['param1','param2'],
					 *      zh     : false,
					 *      callback:function(map){
					 * 			console.log(map); // {param1:value1,param2:v2}
					 *      }
					 *  });
					 * 2、
					 *  formatQueryString(['param1','param2'],function(map){
					 * 		// 返回值同 1
					 *  },false);
					 * 
					 */
					formatQueryString : function(opts){}
				}
			},
			//蓝牙模块
			bluetooth : {
				/**
				 * 是否可用
				 * @param {Function} callback 回调参数 {Boolean} enable
				 */
				isEnabled : function(callback){}
			},
			//系统设置模块
			settting  :{
				/*** 打开蓝牙设置*/
				openBlueTooth : function(){},
				/**
				 * 打开定位设置
				 */
				openLocation  : function(){}
			},
			//定位相关模块
			location  :{
				/**
				 * 是否可用
				 * @param {Object} callback
				 */
				isEnabled : function(callback){}　
			}
		}
	});
	
	/**------------------------以下接口与系统本身耦合比较紧密-------------------**/
	Hoo.apply(Hoo.bridge,{
		platform : {
			/**
			 * 设置界面标题
			 * @param {Object} title
			 * 
			 * @example 
			 * 
			 * setTitle('网页标题');
			 * 
			 */
			setTitle : function(title){}
		},
		project  : {
			/**
			 * 获取系统当前登录用户信息
			 * @param {Function} callback 用于用户信息传递的回调函数
			 * @param {Object} opts 便于今后信息的扩展
			 * 
			 * @example
			 * 
			 * getUser(function(user){
			 * 		console.log('返回的用户信息 : ' + JSON.stringify(user));
			 * });
			 */
			getUser : function(callback,opts){}
		},
		constant : {
			broadcastAction : {
			    //所有平台保持同一个key,value可根据不同平台自己定义
				//sign_handler_success_action : 'com.caidao.sign.unhandler.change'
			}
		}
	})
	
})();/**
 * 模块化 支持包
 */

if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) { // AMD. Register as an anonymous module.
	define(function() {
		return Hoo;
	});
} else if (typeof module !== 'undefined' && module.exports) { //未尝试[NodeJS下]
	module.exports = {};
	module.exports.Hoo = Hoo;
} else {
	window.Hoo = Hoo;
}