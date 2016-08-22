package com.hoo.xshop.module.user.service;

import java.util.List;

import com.hoo.xshop.module.user.entity.ShippingAddrEntity;
import com.hoo.xshop.module.user.model.ShippingAddrModel;

public interface IShippingAddrService {

	public ShippingAddrEntity add(ShippingAddrEntity entity) throws Exception;
	
	public ShippingAddrModel queryT(String id);
	
	public List<ShippingAddrModel> queryLt(String creatorId);
}
