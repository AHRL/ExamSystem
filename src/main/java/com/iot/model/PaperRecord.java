package com.iot.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;

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
public class PaperRecord implements Serializable{

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@OneToOne
	User user;

	@OneToOne()
	PaperInfo  paperInfo;

	private int status;

    private String token;

    private String location;

	private String name;

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

	public PaperRecord(User user, PaperInfo paperInfo, int status, String token, String name, String deadline, int score, String date, String location) {
		this.user = user;
		this.paperInfo = paperInfo;
		this.status = status;
		this.token = token;
		this.name = name;
		this.deadline = deadline;
		this.score = score;
		this.date = date;
		this.location=location;
	}

//	public String toExamedString() {
//		return
//	}

	public PaperRecord() {
	}
}
