/*
Hoo.define('Page.setting.SettingMain',{
	extend  : 'Page.BaseMain',
	listeners:{
	   create : function($page){
	        //BUG: safari 下绑定方式需父类绑		
			$page.find('div[class="weui_navbar_item clickable_div"]').html('为毛不可以?').bind('click',function(){
				alert('-??=-=');
			});
			$page.bind('click',function(event){
				if($(event.target).hasClass('weui_navbar_item')){
					Hoo.Application.back();
					event.preventDefault();
				}
				
				event.stopPropagation();
			});
			
			Hoo.util.Ajax.loadTpl(Hoo.Application.getBasePath() + 'Template/setting/Setting_content',function(content){
				$page.find('.weui_tab_bd').html(content);
				
			});
	   }
	},
	getTpl : function(){
		return '<div class="weui_tab"><div class="weui_navbar"><div class="weui_navbar_item">点我返回</div></div><div class="weui_tab_bd"></div> </div>';
	}
});*/
Hoo.define('Page.setting.SettingMain',{
	extend    : 'Page.BaseMain',
	title     : '设置',
	listeners : {
	   create : function($page){
			Hoo.util.Ajax.loadTpl(Hoo.Application.getBasePath() + 'Template/setting/Setting_content',function(content){
				$page.find('.weui_tab_bd').html(content).find('a').bind('click',function(){
					var tag = $(this).attr('data-tag');
					alert('tag:' + tag);
				});
				
			});
			
	   }
	},
	getTpl : function(){
		return '<div class="weui_tab"><div class="weui_tab_bd"></div></div>';
	}
});