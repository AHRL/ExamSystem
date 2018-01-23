package com.iot.model;

import javax.persistence.*;
import java.sql.Date;
import java.util.List;

/**
 * Created by xiongxiaoyu on 2017/12/17.
 */
@Entity
@Table(name = "record")
public class Record {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private String jsessionId;

	Integer type;

	@ManyToOne
	User user;

	@ManyToMany()
	List<Question> questions;

	private int score;

	private String rightSerial;

	private String answers;

	private String langList;

	public String getJsessionId() {
		return jsessionId;
	}

	public void setJsessionId(String jsessionId) {
		this.jsessionId = jsessionId;
	}

	public String getAnswers() {
		return answers;
	}

	public void setAnswers(String answers) {
		this.answers = answers;
	}

	private String answerList;

	public String getAnswerList() {
		return answerList;
	}

	public void setAnswerList(String answerList) {
		this.answerList = answerList;
	}

	private int count;

	private Date date;

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

	public List<Question> getQuestions() {
		return questions;
	}

	public void setQuestions(List<Question> questions) {
		this.questions = questions;
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public int getScore() {
		return score;
	}

	public void setScore(int score) {
		this.score = score;
	}

	public String getRightSerial() {
		return rightSerial;
	}

	public void setRightSerial(String rightSerial) {
		this.rightSerial = rightSerial;
	}

	public String getLangList() {
		return langList;
	}

	public void setLangList(String typeList) {
		this.langList = typeList;
	}

	public Record() {
	}

	@Override
	public String toString() {
		return "Record{" +
				"id=" + id +
				", jsessionId='" + jsessionId + '\'' +
				", type=" + type +
				", user=" + user +
				", questions=" + questions +
				", score=" + score +
				", rightSerial='" + rightSerial + '\'' +
				", answers='" + answers + '\'' +
				", answerList='" + answerList + '\'' +
				", count=" + count +
				", date=" + date +
				'}';
	}

	public Record(String jsessionId, Integer type, User user, List<Question> questions, int score, String rightSerial, String answers, String answerList, int count,String langList, Date date) {
		this.jsessionId = jsessionId;
		this.type = type;
		this.user = user;
		this.questions = questions;
		this.score = score;
		this.rightSerial = rightSerial;
		this.answers = answers;
		this.answerList = answerList;
		this.count = count;
		this.langList=langList;
		this.date = date;
	}
}
