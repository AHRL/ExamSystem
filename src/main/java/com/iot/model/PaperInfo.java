package com.iot.model;

import javax.persistence.*;
import java.util.List;

/**
 * Created by xiongxiaoyu on 2018/1/14.
 */

@Entity
@Table(name = "paperInfo")
public class PaperInfo {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@ManyToOne
	User user;

	@OneToMany()
	List<ExamQuestion> examQuestion;

	private  String date;
	private  String startTime;
	private  String location;
	private  String endTime;
	private  String type;
	private  String info;
	private  String time;
	private  String token;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public List<ExamQuestion> getExamQuestion() {
		return examQuestion;
	}

	public void setExamQuestion(List<ExamQuestion> examQuestion) {
		this.examQuestion = examQuestion;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getInfo() {
		return info;
	}

	public void setInfo(String info) {
		this.info = info;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public PaperInfo( String startTime, String location, String endTime, String type, String info, String time, String token) {
		this.startTime = startTime;
		this.location = location;
		this.endTime = endTime;
		this.type = type;
		this.info = info;
		this.time = time;
		this.token = token;
	}

	public PaperInfo() {
	}

	//	public PaperInfo(User user, List<ExamQuestion> examQuestion, String date, String startTime, String location, String endTime, String type, String info, String time, String token) {
//		this.user = user;
//		this.examQuestion = examQuestion;
//		this.date = date;
//		this.startTime = startTime;
//		this.location = location;
//		this.endTime = endTime;
//		this.type = type;
//		this.info = info;
//		this.time = time;
//		this.token = token;
//	}
}
