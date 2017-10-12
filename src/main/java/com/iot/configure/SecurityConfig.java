//package com.iot.configure;
//
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
//import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;
//
///**
// * Created by xiongxiaoyu on 2017/10/12.
// */
//
//@Configuration
//@EnableWebMvcSecurity
//public class SecurityConfig extends WebSecurityConfigurerAdapter {
//
//
//    protected void configure(AuthenticationManagerBuilder auth)throws Exception{
//
//    }
//
//    protected void configure(HttpSecurity http)throws Exception{
//        http
//                .authorizeRequests().antMatchers("/*.html").hasAnyAuthority();
//    }
//
//
//}
