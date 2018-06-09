package com.iot.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by xiongxiaoyu on 2018/1/14.
 */




@Setter
@Getter
@Entity
@Table(name = "examQuestion")
public class ExamQuestion {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private Date date;

	private String type;

	private int score;

	@Column(length=1024 )
	private String description;

	@Column(length=1024 )
	private String content;

	public ExamQuestion(Date date,String type, String describe, String content,int score) {
		this.date=date;
		this.type = type;
		this.description = describe;
		this.content = content;
		this.score=score;
	}

	public ExamQuestion() {
	}


	@Override
	public String toString() {
		return "{" +
//				"\"id\":\"" + id +"\","+
				"\"type\":\"" + type + "\"," +
				"\"describe\":\"" + description + "\"," +
				"\"content\":" + content + "" +
				"}";
	}

}
