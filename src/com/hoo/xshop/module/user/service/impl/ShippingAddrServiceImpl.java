package com.hoo.xshop.module.user.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import cn.gilight.commons.DateUtils;
import cn.gilight.framework.dp.DaoSupport;

import com.alibaba.fastjson.JSON;
import com.hoo.xshop.common.mvc.ExceptioinModel;
import com.hoo.xshop.module.user.dao.IShippingAddrDao;
import com.hoo.xshop.module.user.entity.ShippingAddrEntity;
import com.hoo.xshop.module.user.model.ShippingAddrModel;
import com.hoo.xshop.module.user.service.IShippingAddrService;

@Service("shippingAddrService")
public class ShippingAddrServiceImpl implements IShippingAddrService {

	@Resource DaoSupport daoSupport;
	@Resource IShippingAddrDao shippingAddrDao;
	
	public ShippingAddrEntity add(ShippingAddrEntity entity) throws Exception {
		entity.setCreatorId("b6d3137d644949e19d04bf328db60eef");
		entity.setCreateTime(DateUtils.getCurrentTimeMillis());
		
		int count = shippingAddrDao.getCount(entity.getCreatorId());
		if(count >= 10){
			ExceptioinModel model = new ExceptioinModel();
			model.setCode(-1);
			model.setMsg("常用收货地址最多10个.");
			throw new Exception(JSON.toJSONString(model));
		}
		return daoSupport.insert(entity);
	}

	public List<ShippingAddrModel> queryLt(String creatorId) {
		return shippingAddrDao.queryLt(creatorId);
	}

	public ShippingAddrModel queryT(String id) {
		return shippingAddrDao.queryT(id);
	}

}
