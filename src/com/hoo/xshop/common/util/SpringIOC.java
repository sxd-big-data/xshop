package com.hoo.xshop.common.util;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class SpringIOC  implements ApplicationContextAware {

	private static ApplicationContext applicationContext;

	public void setApplicationContext(ApplicationContext ac) throws BeansException {
		applicationContext = ac;
	}

	@SuppressWarnings("unchecked")
	public static <T> T getBean(String name){
		return (T) applicationContext.getBean(name);
	}
	
}