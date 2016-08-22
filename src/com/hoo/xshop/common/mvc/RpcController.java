package com.hoo.xshop.common.mvc;

import java.lang.reflect.Method;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.hoo.xshop.common.util.JsonValidator;

import cn.gilight.framework.mvc.Code;
import cn.gilight.framework.mvc.model.Ajax;
import cn.gilight.framework.mvc.util.ReflectUtil;

@Controller
public class RpcController implements ApplicationContextAware {
	
	private ApplicationContext applicationContext;
	
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.applicationContext = applicationContext;
	}

	
	@ResponseBody
	@RequestMapping("controller/rpc")
	public Ajax doHandler(
			@RequestParam("server") String service,
			@RequestParam("method") String methodName,
			@RequestParam("params") String params){
		
		Object result = null;
		Ajax ajax = new Ajax();
		try {
			Object   object = this.applicationContext.getBean(service);
			JSONArray array = JSON.parseArray(params);
			Method   method = ReflectUtil.findMethod(object.getClass(), methodName, array.size());
			result = ReflectUtil.invoke(object, method, array);
			ajax.setResult(result);
		} catch (Exception e) {
			e.printStackTrace();
			ajax.setCode(Code.exception);
			String exMsg = e.getMessage();
			ExceptioinModel model = new ExceptioinModel();
			if(null != exMsg && JsonValidator.isVal(exMsg)){
				model = JSON.parseObject(exMsg, ExceptioinModel.class);
			}
			if(model.getCode() ==0){
				model.setCode(-1);
				model.setMsg(exMsg == null ? (e.getCause() == null ? "" : e.getCause().getMessage()) : exMsg);
			}
			ajax.setResult(model);
		}
		return ajax;
	}
	
}
