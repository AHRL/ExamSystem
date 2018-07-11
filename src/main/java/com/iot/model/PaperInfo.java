package com.iot.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

/**
 * Created by xiongxiaoyu on 2018/1/14.
 */

@Setter
@Getter
@ToString
@Entity
@Table(name = "paperInfo")
public class PaperInfo {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@ManyToOne
	User user;

	@OneToMany()
	List<ExamQuestion> examQuestions;

	private String name;
	private  String date;
	private  String location;
	private  String type;
	private  String time;
	private Boolean  isSigned;
	private String deadline;
	private int apolicants = 0;

	public PaperInfo() {
	}

	public PaperInfo(String date, String name, User user, String location, String type, String time, Boolean isSigned, String deadline) {
		this.date=date;
		this.name=name;
		this.user=user;
		this.location = location;
		this.type = type;
		this.time = time;
		this.isSigned=isSigned;
		this.deadline=deadline;
	}

	public String toTitle(){

		return "{" +
				"\"title\":\"" + name + "\"," +
				"\"id\":\"" + id + "\"" +
				"}";
	}


	
	public String toBeExaming() {

	return	"{" +
			"\"name\":\"" + name + "\"," +
			"\"date\":\"" + date + "\"," +
			"\"token\":\"" + id + "\"," +
			"\"deadline\":\"" + deadline + "\"," +
			"\"location\":\"" + location + "\"" +
			"}";
	}

	public String getExaming() {
	 return "{" +
			"\"name\":\"" + name + "\"," +
			"\"date\":\"" + date + "\"," +
			"\"token\":\"" + id + "\"," +
			"\"deadline\":\"" + deadline + "\"," +
			"\"isSigned\":" + isSigned + "," +
			"\"location\":\"" + location + "\"" +

			"}";
	}
}
