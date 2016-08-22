package com.hoo.xshop.module.user.model;

/**
 * 用户模型
 * 
 * @author hank
 */
public class UserModel {
	
	private String id;
	private String nickName;
	private String registerResouce;
	private String resouceTag;
	private String bindEmail;
	private String bindPhonenum;

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

}
