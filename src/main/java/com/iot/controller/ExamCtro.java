package com.iot.controller;

import com.google.gson.Gson;
import com.iot.model.QQUser;
import com.iot.model.Question;
import com.iot.model.Record;
import com.iot.model.User;
import com.iot.repository.QuestionRepository;
import com.iot.repository.RecordRepository;
import com.iot.repository.UserRepository;
import com.iot.utils.RandomUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import redis.clients.jedis.Jedis;

import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Date;
import java.util.*;

/**
 * Created by xiongxiaoyu on 2017/10/9.
 */

@Controller
public class ExamCtro {

    private Jedis jedis=new Jedis("118.89.36.125", 6379);
    private Gson gson=new Gson();

    private static String jsessionId;

    private static String username;


    @Autowired
    JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private RecordRepository recordRepository;


    @RequestMapping("/")
    public String index(HttpServletRequest request) throws Exception {
         username=request.getRemoteUser();
         jsessionId=request.getSession().getId();
         jedis.set(username,jsessionId);
//        System.out.println("jsessionId:"+jsessionId+"+username:"+username);
        return "funExam";
    }

    @RequestMapping("/login")
    public String login() throws Exception {
        return "login";
    }

    @RequestMapping("/admin_add")
    public String admin_add() throws Exception {
        return "admin_add";
    }

    @RequestMapping(value = "/onlineLib")
    @PreAuthorize("hasAnyRole('admin','user')")
    public String onlineLib() throws Exception {
        return "onlineLib";
    }

    @RequestMapping("/funExam")
    @PreAuthorize("hasAnyRole( 'user','admin')")
    public String funExam() throws Exception {
        return "funExam";
    }

    @RequestMapping("/404")
    public String forbidden(){
        return "404";
    }

    @RequestMapping("/admin")
    public String admin() throws Exception {
        return "admin";
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

    @RequestMapping("/answersSender")
    @ResponseBody
    public String answersSender(HttpServletRequest request,HttpServletResponse response){

        //获取当前jsessionId会话的record
        Record record=recordRepository.findByJsessionId(jsessionId);
        int score=0;

        //答题数不要之前的count，用更准确的答案个数来确定
        String answers=record.getAnswers();
        answers=answers.substring(1,answers.length()-1);
        String[] dd=answers.replace(" ","").split(",");

        String anwserList[] = new String[dd.length];
        int rightSerial[]= new int[dd.length];

        for (int i = 0; i <dd.length ; i++) {
            anwserList[i]=request.getParameter(String.valueOf(i+1));
//           System.out.println(i+":"+anwserList[i]);
           if(dd[i]!=null) {
               //这里判断答案是否正确，应该要重写这个equals方法。
               if(dd[i].equals(anwserList[i])) {
               rightSerial[i]=1;
               score++;
               }
               else
               rightSerial[i]=0;
           }
        }

        //处理返回给completed的数据
        long time=System.currentTimeMillis()-Long.parseLong(String.valueOf(jedis.hmget(jsessionId,"begin").get(0)));
        Map map=new HashMap();
        map.put("score",score);
        map.put("count",record.getCount());
        map.put("time",time);
        map.put("A",String.valueOf(jedis.hmget(jsessionId,"A").get(0)));
        map.put("B",String.valueOf(jedis.hmget(jsessionId,"B").get(0)));
        map.put("C",String.valueOf(jedis.hmget(jsessionId,"C").get(0)));
        map.put("D",String.valueOf(jedis.hmget(jsessionId,"D").get(0)));

        //使用获取记录然后set参数的方法失效？？？
        //通过创建jpa的sql语句解决
        record.setAnswerList(Arrays.toString(anwserList));
        record.setScore(score);
        record.setRightSerial(Arrays.toString(rightSerial));
        record.setType(1);
        recordRepository.saveAndFlush(record);

        return map.toString();
    }

    @RequestMapping("/onlineLib_practice")
    public String onlineLib_practice() throws Exception {
        return "onlineLib_practice";
    }

    @RequestMapping("/select")
    public String select(@RequestParam(required = false,defaultValue = "null",value = "programmeA")String A,
                         @RequestParam(required = false,defaultValue = "null",value = "programmeB")String B,
                         @RequestParam(required = false,defaultValue = "null",value = "programmeC")String C,
                         @RequestParam(required = false,defaultValue = "null",value = "programmeD")String D,
                         @RequestParam(required = false,value = "count")String count,
                         HttpServletResponse response) throws IOException {
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
        response.addHeader("Access-Control-Max-Age", "1800");

        //jedis的map来带值
        Map<String,String> map=new HashMap<>();
        map.put("A",A);
        map.put("B",B);
        map.put("C",C);
        map.put("D",D);
        map.put("count",count);
        map.put("begin", String.valueOf(System.currentTimeMillis()));//答题练习的开始时间
        jedis.hmset(jsessionId,map);

        //设置会话窗口的存活期
//       jedis.expire(jsessionId,Integer.parseInt(String.valueOf(360)));//设置由就session生成的查询条件map生存期

        //使用session来携带值  但是在security中实现不了
//        request.getSession().setAttribute("A",A);
//        request.getSession().setAttribute("B",B);
//        request.getSession().setAttribute("C",C);
//        request.getSession().setAttribute("D",D);
//        request.getSession().setAttribute("count",count);
//        request.getSession().setAttribute("a",list);
//        request.getSession().setAttribute("lang",request.getParameter("lang"));
//        request.getSession().setAttribute("count",c);
//        response.sendRedirect("/onlineLib_practice");

        return "onlineLib_practice";
    }

    @RequestMapping("/user")
    public String user(@AuthenticationPrincipal UsernamePasswordAuthenticationToken userAuthentication, Model model)
    {
        QQUser user = (QQUser) userAuthentication.getPrincipal();
        model.addAttribute("username", user.getNickname());
        model.addAttribute("avatar", user.getAvatar());
        return "funExam";
    }

    @RequestMapping(value = "/back")
    @ResponseBody
    public List<Question> back(HttpServletRequest request,HttpServletResponse response){
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
        response.addHeader("Access-Control-Max-Age", "1800");

        //通过redis中的map拿到值
        String A= String.valueOf(jedis.hmget(jsessionId,"A").get(0));
        String B= String.valueOf(jedis.hmget(jsessionId,"B").get(0));
        String C= String.valueOf(jedis.hmget(jsessionId,"C").get(0));
        String D=String.valueOf(jedis.hmget(jsessionId,"D").get(0));
        Integer count= Integer.valueOf(jedis.hmget(jsessionId,"count").get(0));

        //session携带值
//        String A= (String) request.getSession().getAttribute("A");
//        String B= (String) request.getSession().getAttribute("B");
//        String C= (String) request.getSession().getAttribute("C");
//        String D= (String) request.getSession().getAttribute("D");
//        Integer count= (Integer) request.getSession().getAttribute("count");

        List<Question> list=questionRepository.find(A,B,C,D,count);

        //把查询出来的答案数组放在字符串answers中,不需要放入jedis去转运，关键设计在于使用好jsessionid
//        jedis.set(username + "answers",String.valueOf(questionRepository.findAnwserList(A,B,C,D,count)));
        String answers=String.valueOf(questionRepository.findAnwserList(A,B,C,D,count));

        //使用构造器来new新的record
        Record record=new Record(jsessionId,0,userRepository.findByUsername(username),list,-1,
                null,answers,null,count,new Date(System.currentTimeMillis()));
//        record.setQuestions(list);
//        record.setUser(userRepository.findByUsername(jedis.get("username")));
//        record.setType(0);
//        record.setCount(count);
//        record.setDate(new Date(System.currentTimeMillis()));
        recordRepository.save(record);

        //iterator迭代器输出当前用户所有的查询记录
//        List<Record> records=recordRepository.findAll();
//        List<Record> records=recordRepository.findUserAnswers(jedis.get("username"));
//        Iterator<Record> i=records.iterator();
//        while(i.hasNext()){
//            Record a=i.next();
//            System.out.print(a.getQuestions());}

        return list;
    }

    @RequestMapping("/report")
    @ResponseBody
    public String report(HttpServletRequest request,HttpServletResponse response){
        List list=new ArrayList();
        int score=0;
//      String lang=(String)request.getSession().getAttribute("lang");
        String count=String.valueOf (request.getSession().getAttribute("count")) ;
        String time= String.valueOf(System.currentTimeMillis()-(long)request.getSession().getAttribute("before"));
System.out.println("count="+time);
//        list.add(lang);
//        list.add(score);
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
//    public String user() throws Exception {
//        return "funExam";
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
