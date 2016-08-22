package com.hoo.xshop.module.shop.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.hoo.xshop.module.shop.entity.GoodsCategoryEntity;

public interface IGoodsCategoryDao {
	
	/**
	 * 查询商品分类列表信息
	 * @param model
	 * @return
	 */
	public List<GoodsCategoryEntity> queryLt(@Param("t") GoodsCategoryEntity entity);
	
	public GoodsCategoryEntity queryT(@Param("id") String id);
	
	
}
