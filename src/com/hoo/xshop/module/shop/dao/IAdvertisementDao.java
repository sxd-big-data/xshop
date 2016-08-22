package com.hoo.xshop.module.shop.dao;

import java.util.List;

import cn.gilight.framework.dp.model.Page;

import com.hoo.xshop.module.shop.entity.AdvertisementEntity;
import com.hoo.xshop.module.shop.model.AdvertisementModel;

public interface IAdvertisementDao {
	public List<AdvertisementModel> queryLtPage(Page page,AdvertisementEntity entity);
}
