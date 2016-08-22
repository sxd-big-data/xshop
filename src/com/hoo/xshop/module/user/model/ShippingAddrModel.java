package com.hoo.xshop.module.user.model;

public class ShippingAddrModel {

	private String id;
	private String receiver;
	private String address;
	private String detailAddr;
	private String contacts;
	private String zipCode;

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

}
