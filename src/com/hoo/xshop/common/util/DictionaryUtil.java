package com.hoo.xshop.common.util;

import org.apache.commons.lang3.StringUtils;


/**
 * 字典表相关工具类
 * @author hank
 *
 */
public class DictionaryUtil {

	/**
	 * 获取下一个全息码
	 * @param code
	 * @return
	 */
	public static String getNextCode(String code){
		String[] codes = code.split("-");
		int num = Integer.parseInt(codes[codes.length - 1]);
		String zero = "";
		for(int i=0;i<4-("" + num).length();i++){
			zero += "0";
		}
		codes[codes.length - 1] = zero + (++num);
		return StringUtils.join(codes, "-");
	}
	
}
