Hoo.define("Cs.widget.Dialog",{
		statics : {
			_dialog:function(opts){
				var dfCfg = {
					htmlParent :{
					   style : ''
					},
					html       : '',
					sureEle    : '',
					id         : null, //如果有ID 则隐藏节点,如果没ID 则移除节点
					beforeShow : function($dialog){},
					afterShow : function($dialog){},
					beforeHide  : function($dialog){},
					beforeDestory: function($dialog){},
					sureClick  : function(){}
				};
				Hoo.copyTo(opts,dfCfg);
				var html = '<div class="weui_dialog_alert" style="display: none;"><div class="weui_mask" style="z-index: 3;"></div><div class="weui_dialog cdui_dialog" style="{style}">{html}</div></div>';
				var style= (dfCfg.htmlParent || {})['style'] || '',cHtml = dfCfg.html || '',$dialog = null;
				if(null != dfCfg.id){ $dialog = $('#' + dfCfg.id); }
				if($dialog == null || $dialog.length == 0){
					$dialog = $(Hoo.util.String.format2(html,{
						style : style,
						html  : cHtml
					})).appendTo(document.body);
					if(dfCfg.id){ $dialog.attr('id',dfCfg.id); }
				}
				
				dfCfg.beforeShow.call($dialog,$dialog);
				$dialog.show();
				dfCfg.afterShow.call($dialog,$dialog);
				//重新绑定一次事件
				var click = function(){
					if(dfCfg.id){ 
						dfCfg.beforeHide.call($dialog,$dialog);
						$dialog.hide(); 
					}else{ 
						dfCfg.beforeDestory.call($dialog,$dialog);
						$dialog.remove();
					}
				};
				
				$dialog.find('.weui_mask').unbind('click').bind('click',click);
				if(dfCfg.sureEle){
					$dialog.find(dfCfg.sureEle).unbind('click').bind('click',function(){
						dfCfg.sureClick.call($dialog,$dialog);
						click();
					});
				}
				return $dialog;
			},
			comment : function(opts) {
				/*
				<div class="weui_dialog_alert" style="display: none;">
					<div class="weui_mask" style="z-index: 3;"></div>
					<div class="weui_dialog cdui_dialog" style="width: 100%;bottom: -56px;top: inherit;background-color: #D5D5D6;">   
					  <div style="padding: 10px 8px;"> 
					    <textarea placeholder="请输入您的评价" style="    border: white;display: flex; height: 60px; font-size: 13px;   padding: 4px; background: white;width: 100%;"></textarea> 
					    <div style=" float:   right; margin:8px 0; line-height: 24px; height:   24px;padding: 0 10px;     vertical-align: middle;background: dodgerblue;color:   white;border-radius: 6px;font-size: 13px;">发表</div> 
					  </div> 
					</div>
				</div>
				*/	
				var dfOpts = {
					htmlParent :{
					   style : 'width: 100%;bottom: -56px;top: inherit;background-color: #D5D5D6;'
					},
					html       : '<div style="padding: 10px 8px;"><textarea data-id="commentContainer" placeholder="请输入您的评价" style="border: white;display: flex; height: 60px; font-size: 13px;   padding: 4px; background: white;width: 100%;"></textarea><div style=" float:   right; margin:8px 0; line-height: 24px; height:   24px;padding: 0 10px;     vertical-align: middle;background: dodgerblue;color:   white;border-radius: 6px;font-size: 13px;" data-id="sure">发表</div> </div> ',
					sureEle    : 'div[data-id="sure"]'
				};
				Hoo.copyTo(opts || {},dfOpts);
				
				//评论组件默认处理
				var bsFn = dfOpts.beforeShow || Hoo.emptyFn;
				dfOpts.beforeShow = function($dialog){
					$dialog.find('textarea').attr('placeholder','请输入您的评价');
					bsFn.call($dialog,$dialog);
				};
				return this._dialog(dfOpts);
			},
			back  : function(opts){
				var id = 'sys_view_back_id',dfOpts = {
					sureClick  : function(){}
				},$dialog = $('#' + id);
				Hoo.copyTo(opts ||{},dfOpts);
				
				if($dialog == null || $dialog.length == 0){
					var html = '<div class="weui_dialog_alert" ><div class="weui_mask" style="z-index: 3;width: 50px;height: 50px;bottom: 100px;right: -25px;top: inherit;left: inherit;line-height: 50px;text-align: center;color: white;border-radius: 50%;">返回</div></div>';
					$dialog = $(html).appendTo(document.body);
					$dialog.attr('id',id);
					
					$dialog.find('.weui_mask').bind('touchmove',function(event){
						var targetTouches = event.originalEvent.targetTouches || event.originalEvent.changedTouches;
					    if (targetTouches.length == 1) {
					  		var touch = targetTouches[0];
					   		$(this).css({
					   			left : (touch.pageX -25)+ 'px',
					   			top  : (touch.pageY -25) + 'px'
					   		});
					    }
					    event.preventDefault();//阻止其他事件
					});
					$dialog.find('.weui_mask').bind('click',function(){
						dfOpts.sureClick.apply(this,arguments);
					});
				}
				return $dialog;
			},
			toast : function(opts){
				if(typeof opts == 'undefined'){ return; }
				if(Hoo.util.Object.isString(opts)){ opts = { content : opts }; }
				var dfOpts = { content : '', delay   : 1000 };
				Hoo.copyTo(opts,dfOpts);
				
				var html = '<div><div class="weui_mask_transparent"></div><div class="weui_toast"><i class="weui_icon_toast"></i><p class="weui_toast_content">{content}</p></div></div>',
				 $dialog = $(Hoo.util.String.format2(html,dfOpts)).appendTo(document.body);
				
				$dialog.delay(dfOpts.delay).hide(function(){
					$(this).remove();
				});
			}
		}
	});