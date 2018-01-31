package com.iot.model;

import javax.persistence.*;
import java.sql.Date;

/**
 * Created by xiongxiaoyu on 2018/1/14.
 */

@Entity
@Table(name = "examQuestion")
public class ExamQuestion {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@ManyToOne
	private PaperInfo paperInfo;

	private Date date;

	private String type;

	@Column(length=1024 )
	private String code;

	@Column(length=1024 )
	private String desc;

	@Column(length = 2048 )
	private String choices;

	public PaperInfo getPaperInfo() {
		return paperInfo;
	}

	public void setPaperInfo(PaperInfo paperInfo) {
		this.paperInfo = paperInfo;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public String getChoices() {
		return choices;
	}

	public void setChoices(String choices) {
		this.choices = choices;
	}

	public ExamQuestion(String type, String code, String desc, String choices) {
		this.type = type;
		this.code = code;
		this.desc = desc;
		this.choices = choices;
	}
}
