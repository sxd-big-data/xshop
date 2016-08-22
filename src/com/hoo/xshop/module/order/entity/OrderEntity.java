package com.hoo.xshop.module.order.entity;

public class OrderEntity {
	/*** 内部订单号 */
	private String id;
	/*** 子订单IDs */
	private String childOrderIds;
	/**
	 * 订单状态 ： 未支付  已取消[取消订单、退货等等]  进行中[发货、快递中、快递完成]  已完成确认
	 */
	private String state;
	/*** 订单创建时间*/
	private String createTime;
	/*** 订单支付时间 */
	private String payforTime;
	/*** 订单完成交付时间 */
	private String doneTime;
	/*** 创建人 */
	private String creatorId;

	public String getId() {
		return id;
	}

	public String getChildOrderIds() {
		return childOrderIds;
	}

	public String getState() {
		return state;
	}

	public String getCreateTime() {
		return createTime;
	}

	public String getPayforTime() {
		return payforTime;
	}

	public String getDoneTime() {
		return doneTime;
	}

	public String getCreatorId() {
		return creatorId;
	}

	public void setId(String id) {
		this.id = id;
	}

	public void setChildOrderIds(String childOrderIds) {
		this.childOrderIds = childOrderIds;
	}

	public void setState(String state) {
		this.state = state;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public void setPayforTime(String payforTime) {
		this.payforTime = payforTime;
	}

	public void setDoneTime(String doneTime) {
		this.doneTime = doneTime;
	}

	public void setCreatorId(String creatorId) {
		this.creatorId = creatorId;
	}
	
	
}
