package com.hoo.xshop.module.shop.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import cn.gilight.commons.DateUtils;
import cn.gilight.framework.dp.DaoSupport;

import com.alibaba.fastjson.JSON;
import com.hoo.xshop.common.DictionaryModel;
import com.hoo.xshop.common.util.DictionaryUtil;
import com.hoo.xshop.module.shop.dao.IGoodsCategoryDao;
import com.hoo.xshop.module.shop.entity.GoodsCategoryEntity;
import com.hoo.xshop.module.shop.service.IGoodsCategoryService;

@Service("goodsCategoryService")
public class GoodsCategoryServiceImpl implements IGoodsCategoryService {

	private String topId = "0";//有且只有一个
	
	@Resource IGoodsCategoryDao goodsCategoryDao;
	@Resource DaoSupport daoSupport;
	
	public List<DictionaryModel> queryLt(GoodsCategoryEntity entity) {
		//默认查询顶级节点的下级节点
		if(null != entity && null == entity.getId() && entity.getParentId() == null){
			entity.setParentId(topId);
		}
		return JSON.parseArray(JSON.toJSONString(goodsCategoryDao.queryLt(entity)), DictionaryModel.class);
	}

	public GoodsCategoryEntity add(GoodsCategoryEntity entity) throws SecurityException, NoSuchFieldException {
		//TODO 做相关处理 code parentId 等等
		if(entity.getParentId() == null){ entity.setParentId(topId); }
		String code = null;
		synchronized (this) {
			//获取对应节点的code 并累加 1 
			GoodsCategoryEntity temp = new GoodsCategoryEntity();
			temp.setParentId(entity.getParentId());
			List<GoodsCategoryEntity> entities = goodsCategoryDao.queryLt(temp);
			if(entities == null || entities.size() == 0){
				GoodsCategoryEntity parentEntity = queryT(entity.getParentId());
				code = parentEntity.getCode() + "-0001";
			}else{
				code = entities.get(entities.size() - 1).getCode();
				code = DictionaryUtil.getNextCode(code);
			}
		}
		entity.setCreateTime(DateUtils.getCurrentTimeMillis());
		entity.setCode(code);
		return daoSupport.insert(entity);
	}

	public GoodsCategoryEntity queryT(String id) {
		return goodsCategoryDao.queryT(id);
	}
	
	
}
