package com.iot.model;

import javax.persistence.*;
import java.util.List;

/**
 * Created by xiongxiaoyu on 2018/1/14.
 */
@Entity
@Table(name = "paperrecord")
public class PaperRecord {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@ManyToOne
	User user;

	@ManyToMany()
	List<Examination> examination;

	private  String type;
	private  String start;
	private  String stop;
	private  String infoNotes;
	private  String keyt;
	private int state;
	private int number;


	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

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

	public List<Examination> getExamination() {
		return examination;
	}

	public void setExamination(List<Examination> examination) {
		this.examination = examination;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getStart() {
		return start;
	}

	public void setStart(String start) {
		this.start = start;
	}

	public String getStop() {
		return stop;
	}

	public void setStop(String stop) {
		this.stop = stop;
	}

	public String getInfoNotes() {
		return infoNotes;
	}

	public void setInfoNotes(String infoNotes) {
		this.infoNotes = infoNotes;
	}

	public String getKeyt() {
		return keyt;
	}

	public void setKeyt(String keyt) {
		this.keyt = keyt;
	}

	public int getNumber() {
		return number;
	}

	public void setNumber(int number) {
		this.number = number;
	}

	public PaperRecord(User user, List<Examination> examination, String type, String start, String stop, String infoNotes, String keyt, int number, int state) {
		this.user = user;
		this.examination = examination;
		this.type = type;
		this.start = start;
		this.stop = stop;
		this.infoNotes = infoNotes;
		this.keyt = keyt;
		this.number=number;
		this.state = state;
	}
}
