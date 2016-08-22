package com.hoo.xshop.module.shop.service;

import java.util.List;

import com.hoo.xshop.common.DictionaryModel;
import com.hoo.xshop.module.shop.entity.GoodsCategoryEntity;

public interface IGoodsCategoryService {

	public GoodsCategoryEntity queryT(String id);
	
	public List<DictionaryModel> queryLt(GoodsCategoryEntity entity);
	
	public GoodsCategoryEntity add(GoodsCategoryEntity entity) throws SecurityException, NoSuchFieldException;
}
