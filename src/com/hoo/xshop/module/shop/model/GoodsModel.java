package com.hoo.xshop.module.shop.model;


public class GoodsModel {
	
	private String id;
	private String title;
	private String description;
	private String imgSrc;
	private double sellingPrice;
	private String goodsCategoryName;
	
	public String getId() {
		return id;
	}
	public String getTitle() {
		return title;
	}
	public String getDescription() {
		return description;
	}
	public String getImgSrc() {
		return imgSrc;
	}
	public double getSellingPrice() {
		return sellingPrice;
	}
	public String getGoodsCategoryName() {
		return goodsCategoryName;
	}
	public void setId(String id) {
		this.id = id;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public void setImgSrc(String imgSrc) {
		this.imgSrc = imgSrc;
	}
	public void setSellingPrice(double sellingPrice) {
		this.sellingPrice = sellingPrice;
	}
	public void setGoodsCategoryName(String goodsCategoryName) {
		this.goodsCategoryName = goodsCategoryName;
	}
	
	
}
