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

	Integer type;

	@ManyToOne
	User user;

	@ManyToMany()
	List<Question> questions;

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

	public Record(Integer type, User user, List<Question> questions, int count, Date date) {
		this.type = type;
		this.user = user;
		this.questions = questions;
		this.count = count;
		this.date = date;
	}
}
