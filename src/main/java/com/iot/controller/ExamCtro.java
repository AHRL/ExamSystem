package com.iot.controller;

import com.iot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by xiongxiaoyu on 2017/10/9.
 */



@Controller
public class ExamCtro{

    @Autowired
    private UserRepository userRepository;


    @RequestMapping("/index")
    public String index(){return "funExam";}
//
//
//    @RequestMapping("/login")
//    public String login(HttpServletRequest request, Model model)
//            throws ServletException, IOException {
//        String Email=request.getParameter("upEmail");
//        String Username=request.getParameter("upUsername");
//        String Password=request.getParameter("upPassword");
//
//        request.getSession().setAttribute("Email",Email);
//        request.getSession().setAttribute("Username",Username);
//        request.getSession().setAttribute("Password",Password);
//
//        model.addAttribute("Email",Email);
//        model.addAttribute("Username",Username);
//        model.addAttribute("Password",Password);
//
//        User user=new User(Email,Username,Password);
//        userRepository.save(user);
//
//        return "404";
//
//    }
//






}
