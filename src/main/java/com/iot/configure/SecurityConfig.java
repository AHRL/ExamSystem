package com.iot.configure;

import com.iot.security.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;

/**
 * Created by xiongxiaoyu on 2017/10/12.
 */

@Configuration
@EnableWebMvcSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)

public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    @Bean
    public UserDetailsService userDetailsService() {
        return new CustomUserDetailsService();
    }

    @Override
    protected  void configure(AuthenticationManagerBuilder auth)
            throws Exception{
        auth.userDetailsService(userDetailsService());
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
//        web.ignoring().antMatchers("/static/**");
        web.ignoring().antMatchers("/img/**","/js/**","/lib/**","/fonts/**","/stylesheets/**");
    }

    @Override
    protected void configure(HttpSecurity http)throws Exception{
        http.headers().frameOptions().disable();
        http.csrf().disable();

        http
                .authorizeRequests()
                .antMatchers("/*.html","/register","/onlineLib","/onlineLib_practice","/registered","/validcode","/admin","/admin_add","/add","/isExist","/select","/mailSender").permitAll()
                .anyRequest().authenticated()
                .and()
                .formLogin().loginPage("/login").defaultSuccessUrl("/funExam")
                .permitAll()
                .and().logout().logoutSuccessUrl("/login")
                .permitAll();

    }

}
