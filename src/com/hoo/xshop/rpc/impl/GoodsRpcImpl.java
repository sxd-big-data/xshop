package com.hoo.xshop.rpc.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.hoo.xshop.common.DictionaryModel;
import com.hoo.xshop.module.shop.entity.GoodsCategoryEntity;
import com.hoo.xshop.module.shop.entity.GoodsEntity;
import com.hoo.xshop.module.shop.model.GoodsModel;
import com.hoo.xshop.module.shop.service.IGoodsCategoryService;
import com.hoo.xshop.module.shop.service.IGoodsService;
import com.hoo.xshop.rpc.IGoodsRpc;

@Service("goodsRpc")
public class GoodsRpcImpl implements IGoodsRpc{
	
	@Resource IGoodsCategoryService goodsCategoryService;
	@Resource IGoodsService goodsService;
	
	public List<GoodsModel> queryHot() {
		return goodsService.queryLt(new GoodsEntity());
	}

	public List<GoodsModel> queryLike() {
		return goodsService.queryLt(new GoodsEntity());
	}

	public List<GoodsModel> queryNew() {
		return goodsService.queryLt(new GoodsEntity());
	}

	public GoodsModel queryTGoods(String goodsId) {
		return goodsService.queryT(goodsId);
	}

	public List<DictionaryModel> queryGoodsCategoryLt(GoodsCategoryEntity entity) {
		return goodsCategoryService.queryLt(entity);
	}

	public GoodsCategoryEntity addCategory(GoodsCategoryEntity entity) throws SecurityException, NoSuchFieldException {
		return goodsCategoryService.add(entity);
	}

	public GoodsEntity addGoods(GoodsEntity entity) throws SecurityException, NoSuchFieldException {
		return goodsService.add(entity);
	}

	public List<GoodsModel> queryLtGoods(GoodsEntity entity) {
		return goodsService.queryLt(entity);
	}
	
}
