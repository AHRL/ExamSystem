package com.iot.model;

import javax.persistence.OneToMany;

/**
 * Created by xiongxiaoyu on 2018/2/28.
 */
public class AnswerSheet {

	@OneToMany
	User user;

	private String name;

	private String stu_id;

	private String major;

	private String qq;

	private String token;






}
