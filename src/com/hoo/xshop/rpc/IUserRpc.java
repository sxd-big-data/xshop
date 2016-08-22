package com.hoo.xshop.rpc;

import java.security.NoSuchAlgorithmException;
import java.util.List;

import cn.gilight.framework.dp.model.Page;

import com.hoo.xshop.module.user.entity.ShippingAddrEntity;
import com.hoo.xshop.module.user.entity.UserEntity;
import com.hoo.xshop.module.user.model.ShippingAddrModel;
import com.hoo.xshop.module.user.model.UserModel;

public interface IUserRpc {
	
	/**
	 * 新增用户[可新增字段:nickName,password] -- 仅作测试
	 * @param entity
	 * @return
	 * @throws NoSuchFieldException 
	 * @throws SecurityException 
	 * @throws NoSuchAlgorithmException 
	 */
	public boolean add(UserEntity entity) throws SecurityException, NoSuchFieldException, NoSuchAlgorithmException;
	
	/**
	 * 修改 -- 仅作测试
	 * @return
	 */
	public boolean update(UserModel model);
	
	/**
	 * 修改密码
	 * @param oldPwd 加密前密码
	 * @param newPwd 新密码(非加密)
	 * @return
	 */
	public boolean changePwd(String oldPwd,String newPwd);
	
	/**
	 * 分页查询用户信息
	 * @param page 分页参数
	 * @param model 查询参数
	 * @return
	 */
	public Page queryLtPage(Page page,UserModel model);
	
	/**
	 * 添加地址
	 * @param entity
	 * @return
	 * @throws Exception 
	 */
	public ShippingAddrEntity addAddr(ShippingAddrEntity entity) throws Exception;
	/**
	 * 获取当前用户收获地址
	 * @return
	 */
	public List<ShippingAddrModel> queryLtAddrs();
	
}
