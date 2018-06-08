package com.iot.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Date;

/**
 * Created by xiongxiaoyu on 2017/11/5.
 */



@Setter
@Getter
@ToString
@Entity
@Table(name = "question")
public class Question implements Serializable{

   @Id
   @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Date date;

    private String type;

    private String answer;

    private String lang;

    @Column(length=1024 )
    private String description;

    @Column(length = 1024 )
    private String content;

    public Question(Date date, String answer, String type, String lang, String description, String content) {
        this.date = date;
        this.type = type;
        this.answer = answer;
        this.lang = lang;
        this.description = description;
        this.content = content;
    }

    public Question() {
    }

    @Override
    public String toString() {
        return "{"+
                "\"lang\":\""+lang+"\""+
                ",\"description\":\""+description+"\""+
                ",\"content\":"+content+""+
                "}";
    }
}
