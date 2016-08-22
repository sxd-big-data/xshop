package com.hoo.xshop.rpc;

import java.util.List;

import com.hoo.xshop.common.DictionaryModel;
import com.hoo.xshop.module.shop.entity.GoodsCategoryEntity;
import com.hoo.xshop.module.shop.entity.GoodsEntity;
import com.hoo.xshop.module.shop.model.GoodsModel;

public interface IGoodsRpc {
	/**
	 * 热销产品
	 * @return
	 */
	public List<GoodsModel> queryHot();
	/**
	 * 新品
	 * @return
	 */
	public List<GoodsModel> queryNew();
	/**
	 * 猜你喜欢(周边最爱)
	 * @return
	 */
	public List<GoodsModel> queryLike();
	
	/**
	 * 获取单一产品信息
	 * @return
	 */
	public GoodsModel queryTGoods(String goodsId);
	
	
	
	/**
	 * 获取商品分类信息(默认一级分类)
	 * @param entity
	 * @return
	 */
	public List<DictionaryModel> queryGoodsCategoryLt(GoodsCategoryEntity entity);

	/**
	 * 添加商品分类
	 * @param entity
	 * @return
	 * @throws SecurityException
	 * @throws NoSuchFieldException
	 */
	public GoodsCategoryEntity addCategory(GoodsCategoryEntity entity) throws SecurityException, NoSuchFieldException;
	
	/**
	 * 添加商品
	 * @param entity
	 * @return
	 * @throws NoSuchFieldException 
	 * @throws SecurityException 
	 */
	public GoodsEntity addGoods(GoodsEntity entity) throws SecurityException, NoSuchFieldException;
	
	/**
	 * 获取商品集合
	 * @param entity
	 * @return
	 */
	public List<GoodsModel> queryLtGoods(GoodsEntity entity);
}
