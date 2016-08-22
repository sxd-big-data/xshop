package com.hoo.xshop.module.shop.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 商品分类实体
 * @author hank
 *
 */
@Entity
@Table(name = "GOODS_CATEGORY")
public class GoodsCategoryEntity {
	/*** 分类ID*/
	@Id
	private String id;
	/*** 分类名称*/
	@Column(name="NAME")
	private String name;
	/*** 父分类ID*/
	@Column(name="PARENT_ID")
	private String parentId;
	/*** 全息码 1000 / 1000-0001 / 1000-1000-0001 */
	@Column(name="CODE")
	private String code;
	/*** 创建时间 */
	@Column(name="CREATE_TIME")
	private long createTime;
	/*** 创建人 */
	@Column(name="CREATOR_ID")
	private String creatorId;
	
	public String getId() {
		return id;
	}
	public String getName() {
		return name;
	}
	public String getParentId() {
		return parentId;
	}
	public String getCode() {
		return code;
	}
	public long getCreateTime() {
		return createTime;
	}
	public String getCreatorId() {
		return creatorId;
	}
	public void setId(String id) {
		this.id = id;
	}
	public void setName(String name) {
		this.name = name;
	}
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public void setCreateTime(long createTime) {
		this.createTime = createTime;
	}
	public void setCreatorId(String creatorId) {
		this.creatorId = creatorId;
	}
	
}
