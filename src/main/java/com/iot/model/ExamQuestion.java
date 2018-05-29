package com.iot.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Date;

/**
 * Created by xiongxiaoyu on 2018/1/14.
 */




@Setter
@Getter
@Entity
@Table(name = "examQuestion")
public class ExamQuestion implements Serializable{

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private Date date;

	private String type;

	@Column(length=1024 )
	private String describe;

	@Column(length=1024 )
	private String content;

	public ExamQuestion(Date date, String type, String description, String content) {
		this.date = date;
		this.type = type;
		this.describe = description;
		this.content = content;
	}

	public ExamQuestion() {
	}

	@Override
	public String toString() {
		return "{" +
				"type:'" + type + '\'' +
				", description:'" + describe + '\'' +
				", content:'" + content + '\'' +
				'}';
	}
}
