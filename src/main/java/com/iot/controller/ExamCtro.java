package com.iot.controller;

import com.iot.model.login.User;
import com.iot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by xiongxiaoyu on 2017/10/9.
 */


@Controller
public class ExamCtro{

    @Autowired
    private UserRepository userRepository;

    @RequestMapping(value = {"/","/funExam"}, method = RequestMethod.GET)
    public String index()
    {return "funExam";}

    @RequestMapping(value = "/login",method = RequestMethod.GET)
    public String login()throws Exception{
        return "login";
    }


    @RequestMapping(value = "/register",method = RequestMethod.GET)
    public String register(HttpServletRequest request) throws  Exception {

        String Email=request.getParameter("upEmail");
        String Username=request.getParameter("upUsername");
        String Password=request.getParameter("upPassword");

        request.getSession().setAttribute("Email",Email);
        request.getSession().setAttribute("Username",Username);
        request.getSession().setAttribute("Password",Password);
//        model.addAttribute("Email",Email);
//        model.addAttribute("Username",Username);
//        model.addAttribute("Password",Password);
        User user=new User(Email,Username,Password);
        user.setRole(User.ROLE.user);
        userRepository.save(user);
        return "404";
    }


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
//
//


}
