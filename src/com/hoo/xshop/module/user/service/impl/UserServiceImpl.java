package com.hoo.xshop.module.user.service.impl;

import java.security.NoSuchAlgorithmException;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import cn.gilight.commons.DateUtils;
import cn.gilight.commons.EncryptionUtils;
import cn.gilight.framework.dp.DaoSupport;
import cn.gilight.framework.dp.model.Page;

import com.hoo.xshop.module.user.dao.IUserDao;
import com.hoo.xshop.module.user.entity.UserEntity;
import com.hoo.xshop.module.user.enums.RegisterResouceEnum;
import com.hoo.xshop.module.user.model.UserModel;
import com.hoo.xshop.module.user.service.IUserService;

@Service("userService")
public class UserServiceImpl implements IUserService {

	@Resource DaoSupport daoSupport;
	
	@Resource IUserDao userDao;
	
	public UserEntity add(UserEntity entity) throws SecurityException, NoSuchFieldException, NoSuchAlgorithmException {
		
		entity.setCreateTime(DateUtils.getCurrentTimeMillis());
		if(entity.getPassword()!= null){
			entity.setPassword(EncryptionUtils.toMD5(entity.getPassword()));
		}
		
		return daoSupport.insert(entity);
	}

	public UserEntity update(UserEntity entity) {
		return daoSupport.update(entity);
	}

	public Page queryLtPage(Page page, UserModel model) {
		userDao.queryLtPage(page, model);
		return page;
	}

	public UserEntity queryT(String resouceTag, String registerResouce) {
		if(RegisterResouceEnum.SYS.toString().equals(registerResouce)){
			String id = resouceTag;
			return userDao.queryById(id);
		}else{
			return userDao.queryByResouceTag(resouceTag, registerResouce);
		}
	}

	public UserEntity queryT(String id) {
		UserEntity entity = queryT(id, RegisterResouceEnum.SYS.toString());
		return entity;
	}

}
