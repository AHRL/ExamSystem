package com.iot.model;

/**
 * Created by xiongxiaoyu on 2018/1/14.
 */
public  class PsdBack{
	public PsdBack(String type, int rightCount, int totalCount) {
		this.type = type;
		this.rightCount = rightCount;
		this.totalCount = totalCount;
	}

	String type;
	int rightCount;
	int totalCount;
}