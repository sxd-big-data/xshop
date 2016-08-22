package com.hoo.xshop.rpc.impl;

import java.security.NoSuchAlgorithmException;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import cn.gilight.framework.dp.model.Page;

import com.hoo.xshop.module.user.entity.ShippingAddrEntity;
import com.hoo.xshop.module.user.entity.UserEntity;
import com.hoo.xshop.module.user.model.ShippingAddrModel;
import com.hoo.xshop.module.user.model.UserModel;
import com.hoo.xshop.module.user.service.IShippingAddrService;
import com.hoo.xshop.module.user.service.IUserService;
import com.hoo.xshop.rpc.IUserRpc;

@Service("userRpc")
public class UserRpcImpl implements IUserRpc{

	@Resource IUserService userService;
	@Resource IShippingAddrService shippingAddrService;
	
	public boolean add(UserEntity entity) throws SecurityException, NoSuchFieldException, NoSuchAlgorithmException {
		return userService.add(entity) != null;
	}

	public boolean update(UserModel model) {
		String id = model.getId();
		UserEntity entity = userService.queryT(id);
		if(null != entity){
			entity.setBindEmail(model.getBindEmail());
			entity.setBindPhonenum(model.getBindPhonenum());
			return userService.update(entity) != null;
		}
		return false;
	}
	
	public boolean changePwd(String oldPwd, String newPwd) {
		//TODO 通过过滤器判断是否登陆用户
		String id = "b6d3137d644949e19d04bf328db60eef";
		UserEntity entity = userService.queryT(id);
		if(null != entity){
			if(oldPwd != null && oldPwd.equals(entity.getPassword())){
				entity.setPassword(newPwd);
				return userService.update(entity) != null;
			}
		}
		return false;
	}
	
	public Page queryLtPage(Page page, UserModel model) {
		return userService.queryLtPage(page, model);
	}
	
	public List<ShippingAddrModel> queryLtAddrs() {
		String creatorId = "b6d3137d644949e19d04bf328db60eef";
		return shippingAddrService.queryLt(creatorId);
	}

	public ShippingAddrEntity addAddr(ShippingAddrEntity entity) throws Exception {
		return shippingAddrService.add(entity);
	}

	
}
