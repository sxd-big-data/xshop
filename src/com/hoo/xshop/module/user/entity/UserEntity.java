package com.hoo.xshop.module.user.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 用户实体
 * @author hank
 *
 */
@SuppressWarnings("serial")
@Entity
@Table(name = "USER")
public class UserEntity implements Serializable{
	@Id
	private String id;
	/*** 昵称 */
	@Column(name="NICK_NAME")
	private String nickName;
	/*** 注册来源 */
	@Column(name="REGISTER_RESOUCE")
	private String registerResouce;
	/*** 注册来源唯一标识(系统注册标识为null/空) */
	@Column(name="RESOUCE_TAG")
	private String resouceTag;
	/*** 绑定邮箱 */
	@Column(name="BIND_EMAIL")
	private String bindEmail;
	/*** 绑定手机号 */
	@Column(name="BIND_PHONENUM")
	private String bindPhonenum;
	//默认收货地址
	
	/*** 密码 */
	@Column(name="PASSWORD")
	private String password;
	/*** 创建时间  */
	@Column(name="CREATE_TIME")
	private long   createTime;
	/*** 创建者id */
	@Column(name="CREATOR_ID")
	private long   creatorId;
	
	public String getId() {
		return id;
	}
	public String getNickName() {
		return nickName;
	}
	public String getRegisterResouce() {
		return registerResouce;
	}
	public String getResouceTag() {
		return resouceTag;
	}
	public String getBindEmail() {
		return bindEmail;
	}
	public String getBindPhonenum() {
		return bindPhonenum;
	}
	public String getPassword() {
		return password;
	}
	public long getCreateTime() {
		return createTime;
	}
	public long getCreatorId() {
		return creatorId;
	}
	public void setId(String id) {
		this.id = id;
	}
	public void setNickName(String nickName) {
		this.nickName = nickName;
	}
	public void setRegisterResouce(String registerResouce) {
		this.registerResouce = registerResouce;
	}
	public void setResouceTag(String resouceTag) {
		this.resouceTag = resouceTag;
	}
	public void setBindEmail(String bindEmail) {
		this.bindEmail = bindEmail;
	}
	public void setBindPhonenum(String bindPhonenum) {
		this.bindPhonenum = bindPhonenum;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public void setCreateTime(long createTime) {
		this.createTime = createTime;
	}
	public void setCreatorId(long creatorId) {
		this.creatorId = creatorId;
	}
	
}
