package com.hoo.xshop.module.order.entity;

public class ChildOrderEntity {
	private String id;
	/*** 商品ID */
	private String goodsId;
	/*** 购买数量*/
	private int num;
	/*** 购买单价【折扣? 实际价格?】*/
	private double price;
	/*** 创建时间 */
	private long createTime;

	//规格、型号?
	
	public String getId() {
		return id;
	}
	public String getGoodsId() {
		return goodsId;
	}
	public int getNum() {
		return num;
	}
	public double getPrice() {
		return price;
	}
	public long getCreateTime() {
		return createTime;
	}
	public void setId(String id) {
		this.id = id;
	}
	public void setGoodsId(String goodsId) {
		this.goodsId = goodsId;
	}
	public void setNum(int num) {
		this.num = num;
	}
	public void setPrice(double price) {
		this.price = price;
	}
	public void setCreateTime(long createTime) {
		this.createTime = createTime;
	}
	
}

