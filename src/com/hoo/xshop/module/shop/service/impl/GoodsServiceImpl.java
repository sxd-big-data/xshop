package com.hoo.xshop.module.shop.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import cn.gilight.commons.DateUtils;
import cn.gilight.framework.dp.DaoSupport;

import com.hoo.xshop.module.shop.dao.IGoodsDao;
import com.hoo.xshop.module.shop.entity.GoodsEntity;
import com.hoo.xshop.module.shop.model.GoodsModel;
import com.hoo.xshop.module.shop.service.IGoodsService;

@Service("goodsService")
public class GoodsServiceImpl implements IGoodsService {

	@Resource DaoSupport daoSupport;
	
	@Resource IGoodsDao goodsDao;
	
	public GoodsEntity add(GoodsEntity entity) throws SecurityException, NoSuchFieldException {
		entity.setCreateTime(DateUtils.getCurrentTimeMillis());
		return daoSupport.insert(entity);
	}

	public List<GoodsModel> queryLt(GoodsEntity entity) {
		return goodsDao.queryLt(entity.getGoodsCategoryId());
	}

	public GoodsModel queryT(String id) {
		return goodsDao.queryT(id);
	}

}
