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

    //自己枚举的权限需要加前缀ROLE_
    public enum ROLE{
    ROLE_admin,ROLE_user
    }

    @Enumerated(EnumType.STRING)
    private ROLE role;

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
                "\"isAdmin\":" + role.equals(ROLE.ROLE_admin) + "," +
                "\"grade\":\"" + grade + "\"," +
                "\"other\":\"" + other + "\"" +
                "}";
    }

}
