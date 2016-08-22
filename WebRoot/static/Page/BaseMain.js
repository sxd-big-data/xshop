Hoo.define('Page.BaseMain',{
	extend : 'Hoo.Base',
	title  : '',
	getTitle  : function(){
		return this.title;
	},
	inited : function(){
		
		//create -> onCreate show --> onResume hide --> onStop
		this.addEvents('create','containerLoad','beforeShow','show','beforeHide','hide','destory');
		this.callParent();
		
		this._pageId = Hoo.getId('page_');
		
		var me = this,
		  $page = $(me.getTpl()).hide().appendTo(document.body);
		  $page.attr('id',me._pageId);
		
		this.fireEvent('create',$page);
		
	},
	getTpl : function(){
		return '<div class="weui_tab" data-role="page" style="-webkit-overflow-scrolling:touch; overflow: auto;"><div class="weui_tab_bd" data-role="page-content"></div><div class="weui_tabbar"></div></div>';
	},
	setTitle : function(title){
		$('#' + this._pageId).find('div[data-role="title"]').html(title);
		Hoo.bridge.platform.setTitle(title);
		this.title = title;
	},
	hide : function(){
		var $page = $('#' + this._pageId);
		
		$page.hide();
	},
	show : function(){
		var $page = $('#' + this._pageId);
		
		$page.show();
	},
	get$Page:function(){
		return $('#' + this._pageId);
	}
});