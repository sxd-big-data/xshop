(function(){
	
	var commentId = Hoo.getId('comment_');
	
	Hoo.define('Page.comment.SingleComment',{
		extend    : 'Page.BaseMain',
		title     : '评论详情',
		listeners : {
		   create : function($page){
				
				Hoo.util.Ajax.loadTpl([Hoo.Application.getBasePath() + 'Template/comment/singleComment',Hoo.Application.getBasePath() + 'Template/comment/commentReplyModule'],function(content,replyTpl){
					$page.find('.weui_tab_bd').html(content);
					$page.find('.weui_tabbar').html(replyTpl);
				});
			
				$page.find('ul[data-id="comment-properties"]').find('li').bind('click',function(){
					$(this).addClass('hoo_tab_item_focus').siblings('.hoo_tab_item_focus').removeClass('hoo_tab_item_focus');
				});
				
				$page.find('div[data-id="view-goodsDetail"]').bind('click',function(){
					Hoo.Application.switchTo('goodsDetail',{goodsId:'811a462ffa4e493c8f79510d407a869f'});
				});
				
				$page.find('div[data-id="comment-reply-container"] span').bind('click',function(){
					var id = $(event.target).attr('data-id');
					console.log(id);
					if(id == 'reply'){
						Cs.widget.Dialog.comment({
							id         : commentId,
							beforeShow : function($dialog){
								//$dialog.find('textarea').attr('placeholder','请输入您的评价');
							},
							afterShow  : function($dialog){
							    $dialog.find('textarea')[0].focus();
								//$dialog.find('textarea').val(commentContext);//.unbind('focus').focus()[0].focus();
							},
							beforeHide : function($dialog){
								
							},
							sureClick  : function($dialog){
								var val = $dialog.find('textarea').val();
								Hoo.bridge.widget.dialog.alert(val);
								$dialog.find('textarea').val(null);
							}
						});
					}
				});
				
				//丝友评论
				$page.find('div[data-id="module-detail"] ul li').unbind('click').bind('click',function(){
					
					var nickName = $(this).find('span[data-id="nickName"]').html();
					Cs.widget.Dialog.comment({
						id         : commentId,
						beforeShow : function($dialog){
							$dialog.find('textarea').attr('placeholder','回复：' + nickName);
						},
						afterShow  : function($dialog){
						    $dialog.find('textarea')[0].focus();
							//$dialog.find('textarea').val(commentContext);//.unbind('focus').focus()[0].focus();
						},
						beforeHide : function($dialog){
							
						},
						sureClick  : function($dialog){
							var val = $dialog.find('textarea').val();
							Hoo.bridge.widget.dialog.alert(val);
							$dialog.find('textarea').val(null);
						}
					});
				});;
				
		   },
		   beforehide:function(){
			  //暂停一些行为、移除某些监听等 当beforeshow的时候再还原
		   	  Cs.widget.Dialog.comment({id : commentId}).find('.weui_mask').trigger('click');
		   }
		},
		getTpl : function(){
			return '<div class="weui_tab" style="overflow: auto;" data-role="page"><div class="weui_tab_bd"  data-role="page-content"></div><div class="weui_tabbar" ></div></div>';
			//return '<div class="weui_tab" data-role="page"><div class="weui_tab_bd" data-role="page-content"></div></div>';
		}
	});
	
})();