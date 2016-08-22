package com.hoo.xshop.rpc.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import cn.gilight.framework.dp.model.Page;

import com.hoo.xshop.module.shop.entity.AdvertisementEntity;
import com.hoo.xshop.module.shop.model.AdvertisementModel;
import com.hoo.xshop.module.shop.service.IAdvertisementService;
import com.hoo.xshop.rpc.IAdvertisementRpc;

@Service("advertisementRpc")
public class AdvertisementRpcImpl implements IAdvertisementRpc {

	@Resource IAdvertisementService advertisementService;
	
	public Page queryLt(Page page, AdvertisementEntity entity) {
		return advertisementService.queryLtPage(page, entity);
	}

	@SuppressWarnings("unchecked")
	public List<AdvertisementModel> queryIndexAd(int maxNum) {
		Page page = new Page();
		page.setLimit(maxNum < 1 ? 4 : maxNum);
		queryLt(page, new AdvertisementEntity());
		return (List<AdvertisementModel>) page.getRows();
	}

	public AdvertisementEntity addAd(AdvertisementEntity entity) throws SecurityException, NoSuchFieldException {
		return advertisementService.add(entity);
	}

}
