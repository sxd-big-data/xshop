package com.hoo.xshop.module.user.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.hoo.xshop.module.user.model.ShippingAddrModel;

public interface IShippingAddrDao {
	
	public int getCount(@Param("creatorId") String creatorId);
	
	public List<ShippingAddrModel> queryLt(@Param("creatorId") String creatorId);
	
	//public List<ShippingAddrModel> queryLtPage(Page page,@Param("t") ShippingAddrEntity entity);
	
	public ShippingAddrModel queryT(@Param("id") String id);
}
