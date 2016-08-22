package com.hoo.xshop.module.shop.service;

import cn.gilight.framework.dp.model.Page;

import com.hoo.xshop.module.shop.entity.AdvertisementEntity;

public interface IAdvertisementService {

	public Page queryLtPage(Page page,AdvertisementEntity entity);
	
	public AdvertisementEntity add(AdvertisementEntity entity) throws SecurityException, NoSuchFieldException;
}
