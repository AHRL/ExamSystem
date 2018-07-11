package com.iot.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by xiongxiaoyu
 * Data:2018/5/17
 * Time:10:53
 */

@Setter
@Getter
@ToString
@Entity
@Table(name = "paperRecord")
public class PaperRecord {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@OneToOne
	User user;

	@OneToOne()
	PaperInfo  paperInfo;

	private int status;

//    private Long token;

    private String location;

	private String name;

	private Date time;

	private String deadline;

	private  int  score;

	private String date;

	@Column(length = 1024 )
	private  String  paperAnswer;

	public PaperRecord(String name, int score, String date) {
		this.name = name;
		this.score = score;
		this.date = date;
	}


	public PaperRecord(User user, PaperInfo paperInfo, int status, String name, String deadline, int score, String date, String location,Date time) {
		this.user = user;
		this.paperInfo = paperInfo;
		this.status = status;
//		this.token = token;
		this.name = name;
		this.deadline = deadline;
		this.score = score;
		this.date = date;
		this.location=location;
		this.time=time;
	}

	public String getExamed() {
		return "{" +
				"\"name\":\"" + name + "\"" +
				", \"score\":\"" + score + "\""+
				", \"date\":\"" + date + "\"" +
				"}";
	}

	public String getExaming() {
		return "{" +
				"\"location\":\"" + location + "\"," +
				"\"name\":\"" + name + "\"," +
				"\"deadline\":\"" + deadline + "\"," +
				"\"date\":\"" + date + "\"" +
				"}";
	}

	public String toShowP(){

		return "{" +
				"\"name\":\"" + name + "\"," +
				"\"stuEmail\":\"" + user.getEmail() + "\"," +
				"\"status\":\"" + String.valueOf(status==1?"readed":"reading") + "\"" +
				"}";
	}


	public PaperRecord() {
	}
}
