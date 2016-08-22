package com.hoo.xshop.module.user.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 收货地址
 * 
 * @author hank
 */
@Entity
@Table(name = "SHIPPING_ADDR")
@SuppressWarnings("serial")
public class ShippingAddrEntity implements Serializable {

	@Id
	private String id;
	/*** 收货人 */
	@Column(name = "RECEIVER")
	private String receiver;
	/*** 收货地区 省-市-县 选择输入 */
	@Column(name = "ADDRESS")
	private String address;
	/*** 详细收货地址 */
	@Column(name = "DETAIL_ADDR")
	private String detailAddr;
	/*** 联系方式 手机或固话 */
	@Column(name = "CONTACTS")
	private String contacts;
	/*** 邮政编码 */
	@Column(name = "ZIP_CODE")
	private String zipCode;
	/*** 创建时间 */
	@Column(name = "CREATE_TIME")
	private long createTime;
	/*** 创建人 */
	@Column(name = "CREATOR_ID")
	private String creatorId;

	public String getId() {
		return id;
	}

	public String getReceiver() {
		return receiver;
	}

	public String getAddress() {
		return address;
	}

	public String getDetailAddr() {
		return detailAddr;
	}

	public String getContacts() {
		return contacts;
	}

	public String getZipCode() {
		return zipCode;
	}

	public void setId(String id) {
		this.id = id;
	}

	public void setReceiver(String receiver) {
		this.receiver = receiver;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public void setDetailAddr(String detailAddr) {
		this.detailAddr = detailAddr;
	}

	public void setContacts(String contacts) {
		this.contacts = contacts;
	}

	public void setZipCode(String zipCode) {
		this.zipCode = zipCode;
	}

	public long getCreateTime() {
		return createTime;
	}

	public String getCreatorId() {
		return creatorId;
	}

	public void setCreateTime(long createTime) {
		this.createTime = createTime;
	}

	public void setCreatorId(String creatorId) {
		this.creatorId = creatorId;
	}

}
