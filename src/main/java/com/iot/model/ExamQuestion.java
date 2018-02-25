package com.iot.model;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Date;

/**
 * Created by xiongxiaoyu on 2018/1/14.
 */

@Entity
@Table(name = "examQuestion")
public class ExamQuestion implements Serializable{

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private Date date;

	private String type;

	@Column(length=1024 )
	private String code;

	@Column(length=1024 )
	private String title;

	@Column(length=1024 )
	private String choices;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}


	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}


	public String getChoices() {
		return choices;
	}

	public void setChoices(String choices) {
		this.choices = choices;
	}

	public ExamQuestion(String title, String type, String code, String choices ) {
		this.type = type;
		this.code = code;
		this.title = title;
		this.choices = choices;
	}
}
