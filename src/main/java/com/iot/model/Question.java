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
    private String info;

    @Column(length=1024 )
    private String code;

    @Column(length = 2048 )
    private String choices;


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
