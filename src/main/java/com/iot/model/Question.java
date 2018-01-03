package com.iot.model;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Date;

/**
 * Created by xiongxiaoyu on 2017/11/5.
 */

@Entity
@Table(name = "question")
public class Question implements Serializable{

   @Id
   @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Date date;

    private String type;

//    private List<String> answer;

    private String lang;

    @Column(length=1024 )
    private String info;

    @Column(length=1024 )
    private String code;

    @Column(length = 2048 )
    private String choices;



//    @ManyToMany
//    Record recorde;



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

    public Question() {
    }


    @Override
    public String toString() {
        return "Question{" +
                "type='" + type + '\'' +
                ", lang='" + lang + '\'' +
                ", info='" + info + '\'' +
                ", code='" + code + '\'' +
                ", choices='" + choices + '\'' +
                '}';
    }
}
