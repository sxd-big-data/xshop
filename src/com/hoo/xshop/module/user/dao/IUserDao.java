package com.hoo.xshop.module.user.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import cn.gilight.framework.dp.model.Page;

import com.hoo.xshop.module.user.entity.UserEntity;
import com.hoo.xshop.module.user.model.UserModel;

public interface IUserDao {
	
	public UserEntity queryById(@Param("id") String id);
	
	public UserEntity queryByResouceTag(@Param("resouceTag") String resouceTag,@Param("registerResouce") String registerResouce);
	
	public List<UserModel> queryLtPage(Page page,@Param("t") UserModel model);
	
	
}