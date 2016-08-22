Hoo.define('Page.goods.GoodsDetail',{
	extend    : 'Page.BaseMain',
	title     : '商品详情',
	listeners : {
	   create : function($page){
			
			Hoo.util.Ajax.loadTpl([Hoo.Application.getBasePath() + 'Template/goods/Goodsdetail_content',Hoo.Application.getBasePath() + 'Template/goods/Goodsdetail_bbar'],function(content,bbar){
				$page.find('.weui_tab_bd').html(content);
				$page.find('.weui_tabbar').html(bbar);
			});
			
			$page.find('ul[data-id="hot-comment"]').find('li').bind('click',function(){
				var commentId = $(this).attr('data-id') || '233';
				Hoo.Application.switchTo('singleComment',{commentId:commentId});
			});
			
			$page.find('a[data-id="view-more-comment"]').bind('click',function(){
				Hoo.Application.switchTo('commentList');
			});
			
			$page.find('ul[data-id="goods-properties"]').find('li').bind('click',function(){
				$(this).addClass('hoo_tab_item_focus').siblings('.hoo_tab_item_focus').removeClass('hoo_tab_item_focus');
			});
			$page.find('.weui_tabbar a').bind('click',function(){
				var id = $(this).attr('data-id');
			
				if('add-shop' == id){
					Cs.widget.Dialog.toast('已添加');
				}else if('buy-justnow' == id){
					//Cs.widget.Dialog.toast('立即购买--购物车');
					Hoo.Application.switchTo('index',{tab:'shop'});
				}
			});
			
	   },
	   beforehide:function(){
		  //暂停一些行为、移除某些监听等 当beforeshow的时候再还原
	   }
	},
	getTpl : function(){
		return '<div class="weui_tab" style="overflow: auto;" data-role="page"><div class="weui_tab_bd"  data-role="page-content"></div><div class="weui_tabbar" ></div></div>';
	}
});