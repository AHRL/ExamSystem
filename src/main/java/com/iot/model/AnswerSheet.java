package com.iot.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.OneToMany;

/**
 * Created by xiongxiaoyu on 2018/2/28.
 */



@Setter
@Getter
@ToString
public class AnswerSheet {

	@OneToMany
	User user;

	private String name;

	private String stu_id;

	private String major;

	private String qq;

	private String token;

}
