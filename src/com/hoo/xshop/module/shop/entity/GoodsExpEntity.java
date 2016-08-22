package com.hoo.xshop.module.shop.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 商品扩展实体
 * @author hank
 */
@SuppressWarnings("serial")
@Entity
@Table(name="GOODS_EXP")
public class GoodsExpEntity implements Serializable{
	@Id
	private String id;
	/*** 商品ID */
	@Column(name="GOODS_ID")
	private String goodsId;
	/*** 商品图 */
	@Column(name="IMG_SRCS")
	private String imgSrcs; // ','隔开
	/*** 上市时间 */
	@Column(name="MARKET_TIME")
	private long marketTime;
	/*** 产品重量 */
	@Column(name="CPZL")
	private String cpzl;
	/*** 所属品牌 */
	@Column(name="PINPAI")
	private String pinpai;
	/*** 产品规格 */
	@Column(name="CPGG")
	private String cpgg;
	/*** 详细描述[大文本]*/
	@Column(name="DESCRIPTION")
	private String description;
	
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getGoodsId() {
		return goodsId;
	}
	public String getImgSrcs() {
		return imgSrcs;
	}
	public long getMarketTime() {
		return marketTime;
	}
	public String getCpzl() {
		return cpzl;
	}
	public String getPinpai() {
		return pinpai;
	}
	public String getCpgg() {
		return cpgg;
	}
	public String getDescription() {
		return description;
	}
	public void setGoodsId(String goodsId) {
		this.goodsId = goodsId;
	}
	public void setImgSrcs(String imgSrcs) {
		this.imgSrcs = imgSrcs;
	}
	public void setMarketTime(long marketTime) {
		this.marketTime = marketTime;
	}
	public void setCpzl(String cpzl) {
		this.cpzl = cpzl;
	}
	public void setPinpai(String pinpai) {
		this.pinpai = pinpai;
	}
	public void setCpgg(String cpgg) {
		this.cpgg = cpgg;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	
}
