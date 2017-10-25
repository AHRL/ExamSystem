package com.iot.controller;

import com.iot.model.login.User;
import com.iot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by xiongxiaoyu on 2017/10/9.
 */


@Controller
public class ExamCtro{

    @Autowired
    private UserRepository userRepository;

    @RequestMapping("/")
    public String index() throws Exception{return "funExam";}

    @RequestMapping("/login")
    public String login()throws Exception{return "login";}

    @RequestMapping(value = "/logout",method = RequestMethod.GET)
    public String logout(HttpServletRequest request, HttpServletResponse response)throws Exception{
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
        if(auth!=null) {
            new SecurityContextLogoutHandler().logout(request,response,auth);
        }
        return "login";
    }

    @RequestMapping("/funExam")
    @PreAuthorize("hasAnyRole( 'user','admin')")
    public String funExam()throws Exception{return "funExam";}


    @RequestMapping(value = "/register",method = RequestMethod.POST)
    public String register(HttpServletRequest request) throws  Exception {
        String Email=request.getParameter("upEmail");
        String Username=request.getParameter("upUsername");
        String Password=request.getParameter("upPassword");

        request.getSession().setAttribute("Username",Username);
        User user=new User(Username,Password,Email,new Date(System.currentTimeMillis()));
        user.setRole(User.ROLE.user);
        userRepository.save(user);
        return "login";
    }

    @RequestMapping("/registered")
    public @ResponseBody List<Long> getUserJson(){
        ArrayList<Long> number=new ArrayList<>();
        for (int i = 0; i <7 ; i++) {
            number.add(userRepository.registeredDaysBefore(new Date(System.currentTimeMillis()-i*24*60*60*1000)));
        }
        return number;
    }


//    @RequestMapping("/onlineExam")
//    @PreAuthorize("hasAnyRole( 'user')")
//    public String onlineExam()throws Exception{return "onlineExam";}
//
//    @RequestMapping("/onlineLib")
//    @PreAuthorize("hasAnyRole('user')")
//    public String onlineLib()throws Exception{return "onlineLib";}



//    @RequestMapping(value = {"/", "/testHome"}, method= RequestMethod.GET)
//    public String home(){
//        return "testHome";
//    }
//
//    @RequestMapping(value = "/testAdmin", method=RequestMethod.GET)
//    @PreAuthorize("hasAnyRole('admin')")
//    public String testAdmin(){
//        return "testAdmin";
//    }
//
//    @RequestMapping(value = "/testUser", method=RequestMethod.GET)
//    @PreAuthorize("hasAnyRole('user','admin')")
//    public String testUser(){
//        return "testUser";
//    }
//
//    @RequestMapping(value = "/testLogin", method=RequestMethod.GET)
//    public String login(){
//        return "testLogin";
//    }
//
//    @RequestMapping("/test403")
//    public String forbidden(){
//        return "test403";
//    }

}
