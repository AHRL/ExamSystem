package com.iot.model.jsonObject;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Created by xiongxiaoyu
 * Data:2018/6/3
 * Time:15:49
 */



@Setter
@Getter
@ToString
public class Transfer {

	private String type;

	private String describe;

	private int  score;

	private String[] content;

	private String answer;



		public String getContent() {
		StringBuffer a=new StringBuffer();
		a.append("[");

		for (int i = 0; i < content.length; i++) {
			a.append("\""+content[i]+"\",");
		}
		a.replace(a.length()-1,a.length(),"]");
		return String.valueOf(a);
	}


}
