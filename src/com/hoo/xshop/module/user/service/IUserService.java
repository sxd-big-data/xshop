package com.hoo.xshop.module.user.service;

import java.security.NoSuchAlgorithmException;

import cn.gilight.framework.dp.model.Page;

import com.hoo.xshop.module.user.entity.UserEntity;
import com.hoo.xshop.module.user.model.UserModel;

public interface IUserService {
	
	public UserEntity add(UserEntity entity) throws SecurityException, NoSuchFieldException, NoSuchAlgorithmException;

	public UserEntity update(UserEntity entity);
	
	public UserEntity queryT(String resouceTag,String registerResouce);
	
	public UserEntity queryT(String id);
	
	public Page queryLtPage(Page page,UserModel model);
	
}
