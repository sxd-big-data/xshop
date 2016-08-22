Hoo.define('Page.index.IndexMain',{
	extend  : 'Page.BaseMain',
	listeners : {
	   create : function($page){
			var me = this;
		    var srcs = ['Template/index/Index_tabbar','Template/index/Index_module_x','Template/index/Index_module_mall','Template/index/Index_module_shop','Template/index/Index_module_more'];
		    var modules = ['module-x','module-mall','module-shop','module-me'];
		    Hoo.util.Array.each(srcs,function(ele,i){ 
		    	Hoo.util.Array.replace(srcs,i,Hoo.Application.getBasePath() + ele);
		    });
		    
			Hoo.util.Ajax.loadTpl(srcs,function(html,xTpl,mallTpl,shopTpl,meTpl){
				var index = -1;
				$page.find('div[class="weui_tabbar"]').html(html);
				
				$page.find('div[data-role="page-content"]').bind('scroll',function(){
					if(index > -1){
						var module = modules[index],
						    tab    = $page.find('div[data-id="'+ module +'"]');
						tab.attr('data-scrollTop',$(this).scrollTop());
					}
				});
				
				$page.find('.weui_tabbar a').bind('click',function(){
					if(index == $(this).index()){ return; }
					$(this).parent().find('a:eq('+ index +')').removeClass("weui_bar_item_on");
					index = $(this).addClass('weui_bar_item_on').index();
					
					var module = modules[index];
					if(module != ''){
						$page.find('div[data-role="tab"]').each(function(){
							if(!$(this).is(":hidden")){
								$(this).hide(); return;
							}
						});
						
						var tab = $page.find('div[data-id="'+ module +'"]');
						if(tab.length == 0){
							var tpl = '';
							if(index == 0){ tpl = xTpl;    }else
							if(index == 1){ tpl = mallTpl; }else
							if(index == 2){ tpl = shopTpl; }else
							if(index == 3){ tpl = meTpl;   }
							$page.find('.weui_tab_bd').append(tpl);
							tab = $page.find('div[data-id="'+ module +'"]');
						
							if(index == 3){
								tab.find('a').bind('click',function(){
									var tag = $(this).attr('data-tag');
									if(tag && tag != ''){
										Hoo.Application.switchTo(tag);
									}else{
										Hoo.bridge.widget.dialog.alert('功能开发中,敬请期待。');
									}
								});
							}else if(index ==0){
								
								tab.find(".prev,.next").hover(function(){
									$(this).stop(true,false).fadeTo("show",0.9);
								},function(){
									$(this).stop(true,false).fadeTo("show",0.4);
								});
								
								tab.find(".banner-box").slide({
									playStateCell:'.playState',
									titCell:".hd ul",
									mainCell:".bd ul",
									effect:"fold",
									interTime:3500,
									delayTime:600,
									autoPlay:true,
									autoPage:true, 
									trigger:"click" 
								});
								//手动控制暂停、播放 tab.find('.playState').click();
								$('.x-goods-item-two li').bind('click',function(){
									Hoo.Application.switchTo('goodsDetail',{goodsId:'811a462ffa4e493c8f79510d407a869f'});
								});
							}else if(index == 1){
				                 $(".commodity-shop-add").click(function(event) {
				                    var img = $(this).parents('.commodity-item').find('img').attr('src');//获取当前点击图片链接
				                    var flyer = $('<img class="flyer-img" src="' + img + '">').css({
				                    	 height:26
				                    	,width :26
				                    	,'border-radius': '50%'
    									,border: '1px solid #ccc'
				                    });
								    var offset = $("#add-shopping-cart").offset();
				                    flyer.fly({
				                        start: {
				                            left: event.pageX,
				                            top: event.pageY
				                        },
				                        end: {
				                            left: offset.left,
				                            top : offset.top + 10,
				                        },
				                        onEnd: function() {
				                            //$("#tip").show().animate({width: '200px'}, 300).fadeOut(500);//成功加入购物车动画效果
				                            this.destory();//销毁抛物体
				                        }
				                    });
				                });
								tab.find('.commodity-item a').bind('click',function(){
									Hoo.Application.switchTo('goodsDetail',{goodsId:'811a462ffa4e493c8f79510d407a869f'});
								});
							}else if(index == 2){
								tab.find('a[data-id="order-now"]').bind('click',function(){
									Hoo.Application.switchTo('orderConfirm');
								});
							}
						}
						//TODO 处理刷新事宜?
						
						tab.show();
						me.fireEvent('show',me);
						var scrollTop = parseFloat(tab.attr('data-scrollTop'));
						if(scrollTop){ 
							$page.find('div[data-role="page-content"]').scrollTop(scrollTop); 
						}
						
					}
				});
				$page.find('.weui_tabbar a:eq('+ (index < 0 ? 0 : index) +')').trigger('click');
				
			});
	   },
	   show:function(container,params){
		   
		   if(params){
			   var tab = params.tab;
			   if(tab == 'shop'){
				   container.get$Page().find('.weui_tabbar a:eq(2)').trigger('click');
			   }
		   }
		  
		   this.get$Page().find('.weui_tabbar a').each(function(){
			  if($(this).hasClass('weui_bar_item_on')){
				  var title = $(this).find('.weui_tabbar_label').html();
				  container.setTitle(title);
				  return;
			  }
		   });
	   }
	}
});