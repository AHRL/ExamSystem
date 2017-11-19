package com.iot.controller;

import com.iot.model.Question;
import com.iot.model.User;
import com.iot.repository.QuestionRepository;
import com.iot.repository.UserRepository;
import com.iot.utils.RandomUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import redis.clients.jedis.Jedis;

import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by xiongxiaoyu on 2017/10/9.
 */


@Controller
public class ExamCtro {

    private Jedis jedis=new Jedis("118.89.36.125", 6379);

    @Autowired
    JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @RequestMapping("/admin_add")
    public String admin_add() throws Exception {
        return "admin_add";
    }

    @RequestMapping("/")
    public String index() throws Exception {
        return "funExam";
    }


    @RequestMapping("/onlineLib")
    public String onlineLib() throws Exception {
        return "onlineLib";
    }

    @RequestMapping("/onlineLib_practice")
    public String onlineLib_practice() throws Exception {
        return "onlineLib_practice";
    }

    @RequestMapping("/test")
    public String test() throws Exception {
        return "test";
    }

    @RequestMapping("/admin")
    public String admin() throws Exception {
        return "admin";
    }

    @RequestMapping("/login")
    public String login(HttpServletRequest request) throws Exception {
        String user =request.getParameter("username");
        request.getSession().setAttribute("user",user);
        return "login";
    }

    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public String logout(HttpServletRequest request, HttpServletResponse response) throws Exception {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return "login";
    }

    @RequestMapping("/funExam")
    @PreAuthorize("hasAnyRole( 'user','admin')")
    public String funExam() throws Exception {
        return "funExam";
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public String register(HttpServletRequest request) throws Exception {
        String Username = request.getParameter("upUsername");
        String Password = request.getParameter("upPassword");
        String Email = request.getParameter("upEmail");
        request.getSession().setAttribute("Username", Username);
        User user = new User(Username, Password, Email, new Date(System.currentTimeMillis()));
        user.setRole(User.ROLE.user);
        userRepository.save(user);
        return "login";
    }


    @RequestMapping(value = "/select",method = RequestMethod.POST)
    public String select(HttpServletRequest request)throws Exception{
        String A =request.getParameter("programmeA");
        String B =request.getParameter("programmeB");
        String C =request.getParameter("programmeC");
        String D =request.getParameter("programmeD");
        int count=Integer.parseInt(request.getParameter("count"));
        List<Question> list=questionRepository.find(A,B,C,D,count);
//        List<Question> list=questionRepository.find(A,B,C,D);

        for (int i = 0; i <list.size(); i++) {
            System.out.print(list.get(i).toString());
        }

//        Iterator it=list.iterator();
//        while (it.hasNext()){
//            System.out.print(it.toString());
//        }

        return "onlineLib_practice";
    }

    @ResponseBody
    @RequestMapping(value = "/add")
    public void add(@RequestParam(value = "type")String type,@RequestParam(value = "lang")String lang,
                                    @RequestParam(value = "info")String info,@RequestParam(value = "code")String code,
                                    @RequestParam(value = "choices")String choices){
        Question question=new Question(type,lang,info,code,choices, new Date(System.currentTimeMillis()));
        questionRepository.save(question);
        System.out.print(question.toString());
//        return "admin_add";
    }

    @ResponseBody
    @RequestMapping(value = "/mailSender")
    public void mailSender(@RequestParam(value = "email")String email, HttpServletRequest request){
        String random= RandomUtil.getRandom();
        System.out.print("xixixixi");
        request.getSession().setAttribute("email",email);
        try {
            jedis.set(email,random);
            jedis.expire(email,Integer.parseInt(String.valueOf(360)));
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setFrom("957400829@qq.com");
            helper.setTo(email);
            helper.setSubject("验证码");
            StringBuffer sb=new StringBuffer();
            sb.append("<p>你好</p>").append("验证码是"+random);
            helper.setText(sb.toString(), true);
            mailSender.send(mimeMessage);
        } catch (javax.mail.MessagingException e) {
            e.printStackTrace();
        }
        System.out.print("hahahahah");
    }


    @RequestMapping(value = "/get")
    @ResponseBody
    public void get(HttpServletRequest request) {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("Accept", "application/json");
        String email=(String) request.getSession().getAttribute("email");
        String validcode=jedis.get(email);
//        return validcode;
    }


    @RequestMapping(value = "/validcode")
    @ResponseBody
    public String validcode(HttpServletRequest request) {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("Accept", "application/json");
        String email=(String) request.getSession().getAttribute("email");
        String validcode=jedis.get(email);
        return validcode;
    }

    @ResponseBody
    @RequestMapping(value = "/isExist",method = RequestMethod.GET)
    public int isExist(@RequestParam(value = "email")String email) {
        User user=userRepository.findByEmail(email);
        System.out.print("hahahahah");
        if(user!=null){return 1;}
        else {return 0;}
    }

    @RequestMapping(value = "/registered")
    @ResponseBody
    public List<Long> registered() {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("Accept", "application/json");
        httpHeaders.set("Content-Type", "application/json");
        ArrayList<Long> number = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            number.add(userRepository.registeredDaysBefore(new Date(System.currentTimeMillis() - i * 24 * 60 * 60 * 1000)));
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
//
//    @RequestMapping(value = "/testUser", method=RequestMethod.GET)
//    @PreAuthorize("hasAnyRole('user','admin')")
//    public String testUser(){
//        return "testUser";
//    }

}
