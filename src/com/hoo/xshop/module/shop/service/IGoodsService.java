package com.hoo.xshop.module.shop.service;

import java.util.List;

import com.hoo.xshop.module.shop.entity.GoodsEntity;
import com.hoo.xshop.module.shop.model.GoodsModel;

/**
 * 商品服务
 * @author hank
 */
public interface IGoodsService {
	
	public GoodsEntity add(GoodsEntity entity) throws SecurityException, NoSuchFieldException;
	
	public GoodsModel queryT(String id);
	/**
	 * 查询商品集合
	 * @param entity [支持查询字段 : goodsCategoryId]
	 * @return
	 */
	public List<GoodsModel> queryLt(GoodsEntity entity);
}
