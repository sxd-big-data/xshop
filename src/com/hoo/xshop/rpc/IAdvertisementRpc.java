package com.hoo.xshop.rpc;

import java.util.List;

import cn.gilight.framework.dp.model.Page;

import com.hoo.xshop.module.shop.entity.AdvertisementEntity;
import com.hoo.xshop.module.shop.model.AdvertisementModel;

public interface IAdvertisementRpc {

	public AdvertisementEntity addAd(AdvertisementEntity entity) throws SecurityException, NoSuchFieldException;
	
	public Page queryLt(Page page,AdvertisementEntity entity);
	
	/**
	 * 获取首页顶部广告【后续智能改造】
	 * @param maxNum
	 * @return
	 */
	public List<AdvertisementModel> queryIndexAd(int maxNum);
	
}
