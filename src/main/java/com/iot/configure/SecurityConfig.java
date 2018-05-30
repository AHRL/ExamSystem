package com.iot.configure;

import com.iot.filter.qq.QQAuthenticationFilter;
import com.iot.filter.qq.QQAuthenticationManager;
import com.iot.security.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Created by xiongxiaoyu on 2017/10/12.
 */

@Configuration
@EnableWebMvcSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)//使@preAuthorize生效
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    @Bean
    public UserDetailsService userDetailsService() {
        return new CustomUserDetailsService();
    }

    @Override
    protected  void configure(AuthenticationManagerBuilder auth)
            throws Exception{
        auth.userDetailsService(userDetailsService());//这里作用是引入dataInit的配置
        //内存申明一个用户，用于简单调试security
        auth.inMemoryAuthentication().withUser("xixixi").password("123456").roles("user");
    }

    //使@preAuthorize生效
    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/img/**","/js/**","/lib/**","/fonts/**","/dist/**","/aip/**","/stylesheets/**");
    }

    @Override
    protected void configure(HttpSecurity http)throws Exception{
        http.headers().frameOptions().disable();
        http.csrf().disable();

        http.authorizeRequests()
                .antMatchers("/register","/*.html","/onlineLib","/report"
                        ,"/back","/onlineLib_practice","/select","/registered","/validcode"
                        ,"/admin","/admin_add","/add","/select","/mailSender"
                        ,"/answersSender","/test","/onlineLib_result","/skill_chart"
                        ,"/admin_publish","/exam_add","/.well-known/pki-validation/fileauth.txt"
                        ,"/personal","/personalInfo","/api/**","/userPaper").permitAll()
                .anyRequest().authenticated()
                .and()
                .formLogin().loginPage("/login").defaultSuccessUrl("/")
                .permitAll()
                .and().logout().logoutSuccessUrl("/login")
                .permitAll();

        http.addFilterBefore(qqAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
//       http.addFilter(qqAuthenticationFilter());
//        UsernamePasswordAuthenticationFilter.class
    }

    private QQAuthenticationFilter qqAuthenticationFilter(){
        QQAuthenticationFilter authenticationFilter = new QQAuthenticationFilter("/login/qq");
        SimpleUrlAuthenticationSuccessHandler successHandler = new SimpleUrlAuthenticationSuccessHandler();
        successHandler.setAlwaysUseDefaultTargetUrl(true);
        successHandler.setDefaultTargetUrl("/user");
        authenticationFilter.setAuthenticationManager(new QQAuthenticationManager());
        authenticationFilter.setAuthenticationSuccessHandler(successHandler);
        return authenticationFilter;
}

}
