package com.iot.model.login;

import javax.persistence.*;

/**
 * Created by xiongxiaoyu on 2017/10/9.
 */


@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Long id;

    private String Email;
    private String Username;
    private String Password;

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        this.Email = email;
    }

    public String getUsername() {
        return Username;
    }

    public void setUsername(String username) {
        this.Username = username;
    }

    public String getPassword() {
        return Password;
    }

    public void setPassword(String password) {
        this.Password = password;
    }

    public User(String email, String username, String password) {
        Email = email;
        Username = username;
        Password = password;
    }
}
