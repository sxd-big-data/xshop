package com.hoo.xshop.module.order.model;

public class ChildOrderModel {
	
	private String id;
	private String goodsId;//通过商品id来访问对应的商品详情
	private int num;
	private double price;
	
	
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
	
}
