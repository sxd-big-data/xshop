package com.hoo.xshop.module.shop.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import cn.gilight.commons.DateUtils;
import cn.gilight.framework.dp.DaoSupport;
import cn.gilight.framework.dp.model.Page;

import com.hoo.xshop.module.shop.dao.IAdvertisementDao;
import com.hoo.xshop.module.shop.entity.AdvertisementEntity;
import com.hoo.xshop.module.shop.service.IAdvertisementService;

@Service("advertisementService")
public class AdvertisementServiceImpl implements IAdvertisementService {

	@Resource DaoSupport daoSupport;
	
	@Resource IAdvertisementDao advertisementDao;
	
	public Page queryLtPage(Page page, AdvertisementEntity entity) {
		advertisementDao.queryLtPage(page, entity);
		return page;
	}

	public AdvertisementEntity add(AdvertisementEntity entity) throws SecurityException, NoSuchFieldException {
		entity.setCreateTime(DateUtils.getCurrentTimeMillis());
		return daoSupport.insert(entity);
	}

}
