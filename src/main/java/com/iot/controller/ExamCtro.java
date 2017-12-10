package com.iot.controller;

import com.google.gson.Gson;
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
    private Gson gson=new Gson();

    @Autowired
    JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;


    @RequestMapping("/")
    public String index() throws Exception {
        return "funExam";
    }

    @RequestMapping("/admin_add")
    public String admin_add() throws Exception {
        return "admin_add";
    }

    @RequestMapping("/onlineLib")
    public String onlineLib() throws Exception {
        return "onlineLib";
    }

    @RequestMapping("/funExam")
    @PreAuthorize("hasAnyRole( 'user','admin')")

    public String funExam() throws Exception {
        return "funExam";
    }

    @RequestMapping("/onlineLib_practice")
    public String onlineLib_practice() throws Exception {
        return "onlineLib_practice";
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

    @RequestMapping("/user")
    public String user() throws Exception {
        return "funExam";
    }

    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public String logout(HttpServletRequest request, HttpServletResponse response) throws Exception {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return "login";
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
        return "/funExam";
    }


    @RequestMapping(value = "/mailSender")
    @ResponseBody
    public String mailSender(@RequestParam(value = "email")String email, HttpServletRequest request){
        String random= RandomUtil.getRandom();
        request.getSession().setAttribute("email",email);
        try {
//            jedis.set(email,random);
//            jedis.expire(email,Integer.parseInt(String.valueOf(360)));
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setFrom("957400829@qq.com");
            helper.setTo(email);
            helper.setSubject("验证码");
            StringBuffer sb=new StringBuffer();
            sb.append("<p>你好</p>").append("验证码是"+random);
            helper.setText(sb.toString(), true);
            mailSender.send(mimeMessage);
            System.out.print("hahahahah");
        } catch (javax.mail.MessagingException e) {
            e.printStackTrace();
        }
        return random;
    }


    @RequestMapping("/select")
    public String select(@RequestParam(required = false,value = "programmeA")String A,@RequestParam(required = false,value = "programmeB")String B,@RequestParam(required = false,value = "programmeC")String C,
                         @RequestParam(required = false,value = "programmeD")String D,@RequestParam(required = false,value = "count")String count,HttpServletResponse response,HttpServletRequest request){
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
        response.addHeader("Access-Control-Max-Age", "1800");
        int c=Integer.parseInt(count);
        List<Question> list=questionRepository.find(A,B,C,D,c);
        request.getSession().setAttribute("list",list);
//        request.getSession().setAttribute("lang",request.getParameter("lang"));
//        request.getSession().setAttribute("count",c);
//        request.getSession().setAttribute("before",System.currentTimeMillis());
//        List<Question> a= (List<Question>) request.getSession().getAttribute("list");
        jedis.set("a",gson.toJson(list));

        return "onlineLib_practice";
    }

    @RequestMapping(value = "/back")
    @ResponseBody
    public String back(HttpServletRequest request,HttpServletResponse response){
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
        response.addHeader("Access-Control-Max-Age", "1800");
//        List<Question> a= (List<Question>) request.getSession().getAttribute("list");
        return gson.toJson(jedis.get("a"));
    }

    @RequestMapping("/report")
    @ResponseBody
    public String report(HttpServletRequest request,HttpServletResponse response){
        List list=new ArrayList();
        int score=0;
//        String lang=(String)request.getSession().getAttribute("lang");
        String count=(String)request.getSession().getAttribute("count");
System.out.println("测试测试"+request.getSession().getAttribute("before"));
        String time= String.valueOf(System.currentTimeMillis()-(long)request.getSession().getAttribute("before"));
System.out.println("测试测试"+count+"测试测试"+time);
//        list.add(lang);
        list.add(score);
        list.add(count);
        list.add(time);
        return  gson.toJson(list);
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
    @RequestMapping(value = "/isExist",method = RequestMethod.GET)
    public int isExist(@RequestParam(value = "email")String email) {
        User user=userRepository.findByEmail(email);
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

//    @RequestMapping("/onlineLib")
//    @PreAuthorize("hasAnyRole('user')")
//    public String onlineLib()throws Exception{return "onlineLib";}

//    @RequestMapping(value = "/testUser", method=RequestMethod.GET)
//    @PreAuthorize("hasAnyRole('user','admin')")
//    public String testUser(){
//        return "testUser";
//    }

//    @RequestMapping(value = "/validcode")
//    @ResponseBody
//    public String validcode(HttpServletRequest request) {
//        HttpHeaders httpHeaders = new HttpHeaders();
//        httpHeaders.set("Accept", "application/json");
//        String email=(String) request.getSession().getAttribute("email");
//        String validcode=jedis.get(email);
//        return validcode;
//    }

//    @RequestMapping(value = "/get")
//    @ResponseBody
//    public void get(HttpServletRequest request) {
//        HttpHeaders httpHeaders = new HttpHeaders();
//        httpHeaders.set("Accept", "application/json");
//        String email=(String) request.getSession().getAttribute("email");
//        String validcode=jedis.get(email);
////        return validcode;
//    }

//    @RequestMapping("/user")
//    public String user(@AuthenticationPrincipal UsernamePasswordAuthenticationToken userAuthentication, Model model)
//    {
//        QQUser user = (QQUser) userAuthentication.getPrincipal();
//        model.addAttribute("username", user.getNickname());
//        model.addAttribute("avatar", user.getAvatar());
//        return "user";
//    }

//    @RequestMapping("/onlineLib")
//    @ResponseBody
//    public String onlineLib(HttpServletResponse response) throws Exception {
//        response.addHeader("Access-Control-Allow-Origin", "*");
//        response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
//        response.addHeader("Access-Control-Max-Age", "1800");
//        String a="[{\"id\":3,\"date\":\"2017-11-02\",\"type\":\"96\",\"lang\":\"C\",\"info\":\"7\",\"code\":\"7\",\"choices\":\"6\"},{\"id\":4,\"date\":\"2017-11-09\",\"type\":\"7\",\"lang\":\"C\",\"info\":\"4\",\"code\":\"4\",\"choices\":\"4\"},{\"id\":5,\"date\":null,\"type\":\"5\",\"lang\":\"C\",\"info\":\"5\",\"code\":\"5\",\"choices\":\"5\"},{\"id\":6,\"date\":\"2017-11-03\",\"type\":\"7\",\"lang\":\"C\",\"info\":\"7\",\"code\":\"7\",\"choices\":\"7\"},{\"id\":7,\"date\":null,\"type\":\"9\",\"lang\":\"Java\",\"info\":\"8\",\"code\":\"8\",\"choices\":\"8\"},{\"id\":8,\"date\":\"2017-12-04\",\"type\":\"单选\",\"lang\":\"C\",\"info\":\"要去掉文本超链接的下划线，下列正确的是（）\",\"code\":\"public class Solution {\\r\\n    public boolean Find(int target, int [][] array) {\\r\\n\\r\\n    }\\r\\n}\",\"choices\":\"a{underline:none},a{text-decoration:none},a{text-decoration:underline},a{decoration:no underline}\"}]\n";
//        return a;
//    }

//    @RequestMapping(value = "/select",method = RequestMethod.POST)
//    public String select(HttpServletRequest request)throws Exception{
//        String A =request.getParameter("programmeA");
//        String B =request.getParameter("programmeB");
//        String C =request.getParameter("programmeB");
//        String D =request.getParameter("programmeD");
//        int count=Integer.parseInt(request.getParameter("count"));
//        List<Question> list=questionRepository.find(A,B,C,D,count);
//        for (int i = 0; i <list.size(); i++) {
//            System.out.print(list.get(i).toString());
//        }
//        request.getSession().setAttribute("list",list);
//        System.out.print("list"+list);
//        jedis.set("test", gson.toJson(list));
//        return "onlineLib";
//    }
}
