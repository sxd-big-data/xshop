Hoo.define('Page.comment.CommentList',{
	extend    : 'Page.BaseMain',
	title     : '商品评论',
	listeners : {
	   create : function($page){
			Hoo.util.Ajax.loadTpl([Hoo.Application.getBasePath() + 'Template/comment/commentList'],function(content){
				$page.find('.weui_tab_bd').html(content);
			});
			
			$page.find('.comment-list li').bind('click',function(){
				var commentId = $(this).attr('data-id') || '233';
				Hoo.Application.switchTo('singleComment',{commentId:commentId});
			});
	   },
	   beforehide:function(){
		  //暂停一些行为、移除某些监听等 当beforeshow的时候再还原
	   }
	},
	getTpl : function(){
		return '<div class="weui_tab" data-role="page"><div class="weui_tab_bd" data-role="page-content"></div></div>';
	}
});