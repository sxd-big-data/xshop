package com.hoo.xshop.common.mvc;

/**
 * rpc异常模型
 * @author hank
 */
public class ExceptioinModel {
	
	
	
	/*** 
	 * 错误码 (参照通用规范)
	 * 0     指json转换时,未成功
	 * -1   未定义错误
	 * 
	 * 
	 * 
	 * 
	 * */
	private int code = 0;
	/*** 错误消息 */
	private String msg;
	
	
	public int getCode() {
		return code;
	}
	public String getMsg() {
		return msg;
	}
	public void setCode(int code) {
		this.code = code;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	
	
}
