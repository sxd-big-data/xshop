Hoo.define('Page.order.OrderMain',{
	extend    : 'Page.BaseMain',
	title     : '我的订单',
	listeners : {
	   create : function($page){
			Hoo.util.Ajax.loadTpl(Hoo.Application.getBasePath() + 'Template/order/Order_navbar',function(content){
				var index = -1;
				$page.find('.weui_tab_bd').append(content).find('.hoo_custom_tab_item').bind('click',function(){
					$(this).addClass('hoo_custom_tab_item_focus').siblings('.hoo_custom_tab_item_focus').removeClass('hoo_custom_tab_item_focus');
					index = $(this).index();
					//这里做tab切换处理		
					
				});
				$page.find('.weui_tab_bd').find('.hoo_custom_tab_item:eq(0)').trigger('click');
				
			});
			
	   }
	},
	getTpl : function(){
		//nav bar ?
		return '<div class="weui_tab"  style="margin-bottom:0px;"><div class="weui_tab_bd"></div></div>';
	}
});