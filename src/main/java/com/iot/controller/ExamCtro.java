package com.iot.controller;

import com.iot.model.login.User;
import com.iot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * Created by xiongxiaoyu on 2017/10/9.
 */



@Controller
public class ExamCtro{

    @Autowired
    private UserRepository userRepository;


    @RequestMapping("/")
    public String index(){return "login";}

//, @RequestParam(name = "upEmail")String email

    @RequestMapping("/login")
    public String login(HttpServletRequest request)
            throws ServletException, IOException {
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
        userRepository.save(user);
        return "404";

    }

}
