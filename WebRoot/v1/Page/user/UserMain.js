Hoo.define('Page.user.UserMain',{
	extend    : 'Page.BaseMain',
	title     : '个人信息',
	listeners : {
	   create : function($page){
			Hoo.util.Ajax.loadTpl(Hoo.Application.getBasePath() + 'Template/user/User_content',function(content){
				$page.find('.weui_tab_bd').html(content).find('a').bind('click',function(){
					var tag = $(this).attr('data-tag');
					Hoo.bridge.widget.dialog.alert('tag:' + tag);
				});
				
			});
			
	   }
	},
	getTpl : function(){
		return '<div class="weui_tab"><div class="weui_tab_bd"></div></div>';
	}
});