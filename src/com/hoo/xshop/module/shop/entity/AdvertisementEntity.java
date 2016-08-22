package com.hoo.xshop.module.shop.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 广告实体[目前放置在首页]
 * @author hank
 *
 */
@SuppressWarnings("serial")
@Entity
@Table(name="ADVERTISEMENT")
public class AdvertisementEntity implements Serializable{
	@Id
	private String id;
	/*** 广告标题 */
	@Column(name="TITLE")
	private String title;
	/*** 广告图片地址 */
	@Column(name="IMG_SRC")
	private String imgSrc;
	/*** 实际跳转地址 */
	@Column(name="URL")
	private String url;
	@Column(name="CREATOR_ID")
	private String creatorId;
	@Column(name="CREATE_TIME")
	private long   createTime;
	/*** 所属类型 */
	@Column(name="TYPE")
	private String type = "goods";// goods same ...
	
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
	public String getCreatorId() {
		return creatorId;
	}
	public long getCreateTime() {
		return createTime;
	}
	public String getType() {
		return type;
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
	public void setCreatorId(String creatorId) {
		this.creatorId = creatorId;
	}
	public void setCreateTime(long createTime) {
		this.createTime = createTime;
	}
	public void setType(String type) {
		this.type = type;
	}
	
}
