package com.iot.model.login;

import javax.persistence.*;
import java.sql.Date;

/**
 * Created by xiongxiaoyu on 2017/10/9.
 */

@Entity
@Table(name = "user")
public class User {

    Date date;

    public enum ROLE{
    admin,user;
    }

    @Enumerated(EnumType.STRING)
    private ROLE role;


    @Id
    private String username;

    private String password;
    private String email;

    public ROLE getRole() {
        return role;
    }

    public void setRole(ROLE role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public User() {
    }

    public User(String username, String password, String email ,Date date) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.date = date;
    }

    @Override
    public String toString() {
        return "User{" +
                "role=" + role +
                ", email='" + email + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
