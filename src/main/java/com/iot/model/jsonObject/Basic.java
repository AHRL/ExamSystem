package com.iot.model.jsonObject;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Created by xiongxiaoyu
 * Data:2018/6/3
 * Time:22:14
 */



@Setter
@Getter
@ToString
public class Basic {

	private String  describe;
	private String  type;
	private String  date;
	private String  time;
	private String  location;
	private String  deadline;

}
