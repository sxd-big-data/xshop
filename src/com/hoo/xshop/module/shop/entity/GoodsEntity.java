package com.hoo.xshop.module.shop.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 商品实体
 * @author hank
 *
 */
@SuppressWarnings("serial")
@Entity
@Table(name = "GOODS")
public class GoodsEntity implements Serializable{
	/*** 主键 */
	@Id
	private String id;
	/*** 商品名称 */
	@Column(name="TITLE")
	private String title;
	/*** 商品描述 */
	@Column(name="DESCRIPTION")
	private String description;
	/*** 图片路径*/
	@Column(name="IMG_SRC")
	private String imgSrc;
	/*** 当前售价 */
	@Column(name="SELLING_PRICE")
	private double sellingPrice;
	/*** 商品原价 */
	@Column(name="COST_PRICE")
	private double costPrice;
	/*** 商品所属二级分类[一级 && 二级分类关系由逻辑指定] */
	@Column(name="GOODS_CATEGORY_ID")
	private String goodsCategoryId;
	/*** 创建时间 */
	@Column(name="CREATE_TIME")
	private long createTime;
	
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
	public double getCostPrice() {
		return costPrice;
	}
	public String getGoodsCategoryId() {
		return goodsCategoryId;
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
	public void setCostPrice(double costPrice) {
		this.costPrice = costPrice;
	}
	public void setGoodsCategoryId(String goodsCategoryId) {
		this.goodsCategoryId = goodsCategoryId;
	}
	public long getCreateTime() {
		return createTime;
	}
	public void setCreateTime(long createTime) {
		this.createTime = createTime;
	}
	
}
