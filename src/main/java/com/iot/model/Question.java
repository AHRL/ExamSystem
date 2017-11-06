package com.iot.model;

import javax.persistence.*;
import java.sql.Date;

/**
 * Created by xiongxiaoyu on 2017/11/5.
 */

@Entity
@Table(name = "question")
public class Question {

   @Id
   @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Date date;
    private String type;
    private String lang;
    private String info;
    private String code;
    private String choices;

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

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getChoices() {
        return choices;
    }

    public void setChoices(String choices) {
        this.choices = choices;
    }

    public Question(String type, String Lang, String info, String code, String choices, Date date) {
        this.type = type;
        this.lang = Lang;
        this.info = info;
        this.code = code;
        this.choices = choices;
        this.date = date;
    }
}
