package com.hoo.xshop.module.shop.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.hoo.xshop.module.shop.model.GoodsModel;

public interface IGoodsDao {

	public List<GoodsModel> queryLt(@Param("goodsCategoryId") String goodsCategoryId);
	
	public GoodsModel queryT(@Param("id") String id);
}
