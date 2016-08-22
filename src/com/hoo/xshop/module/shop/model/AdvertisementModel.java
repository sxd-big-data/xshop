package com.hoo.xshop.module.shop.model;


public class AdvertisementModel {

	private String id;
	private String title;
	/*** 图片路径 */
	private String imgSrc;
	/*** 跳转地址 */
	private String url;
	/*** 现对跳转地址 */
	private String relationUrl;
	
	public String getId() {
		return id;
	}
	public String getTitle() {
		return title;
	}
	public String getImgSrc() {
		return imgSrc;
	}
	public String getUrl() {
		return url;
	}
	public void setId(String id) {
		this.id = id;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public void setImgSrc(String imgSrc) {
		this.imgSrc = imgSrc;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getRelationUrl() {
		//TODO 根据url 解析出相对地址
		this.relationUrl = this.url;
		return this.relationUrl;
	}
	public void setRelationUrl(String relationUrl) {
		this.relationUrl = relationUrl;
	}
	
}
