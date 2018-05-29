package com.iot.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.sql.Date;

/**
 * Created by xiongxiaoyu on 2017/10/9.
 */



@Setter
@Getter
@ToString
@Entity
@Table(name = "user")
public class User {

    Date date;

    public enum ROLE{
    ROLE_admin,ROLE_user;
    }

    @Enumerated(EnumType.STRING)
    private ROLE role;

//    @OneToMany
//    List<Record> recordes;

    @Id
    private String username;
    private String password;
    private String email;
    private String grade;
    private String major;
    private String other;


    public User() {
    }

    public User(String username, String password, String email ,Date date) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.date = date;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String userInfo() {
        return "{" +
                "\"username\":\"" + username + "\"," +
                "\"major\":\"" +major + "\"," +
                "\"grade\":\"" + grade + "\"," +
                "\"other\":\"" + other + "\"" +
                "}";
    }

}
