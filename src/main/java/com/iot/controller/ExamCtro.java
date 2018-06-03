package com.iot.controller;

import com.google.gson.Gson;
import com.iot.model.*;
import com.iot.repository.*;
import com.iot.utils.RandomUtil;
import com.iot.utils.StringUtil;
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
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by xiongxiaoyu on 2017/10/9.
 */

@Controller
public class ExamCtro {

    private Jedis jedis=new Jedis("118.89.36.125", 6379);

    private Gson gson=new Gson();

    private User user;

    private PaperInfo paperInfo;

    private PsdBack psdBack;

    private static  String lang[]=new String[]{"HTML+CSS","JavaScript","Java","C"};

    private ExamQuestion examQuestion;

    private static String jsessionId;

    private static String username;


    StringUtil  stringUtil=new StringUtil();

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExamQuestionRepository examQuestionRepository;

    @Autowired
    private PaperInfoRepository paperInfoRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private RecordRepository recordRepository;


    @ResponseBody
    @RequestMapping(value = "/",produces="application/json;charset=UTF-8")
    public String index(HttpServletRequest request,Model model){
         username=request.getRemoteUser();
         jsessionId=request.getSession().getId();
         jedis.set(jsessionId,username);
//        System.out.println("jsessionId:"+jsessionId+"+username:"+username);
       model.addAttribute("username",username);


        return "{\"username\":\""+username+"\",\"JsessionId\":\""+jsessionId+"\"}";
//        return "funExam";
    }

    @ResponseBody
    @RequestMapping("/.well-known/pki-validation/fileauth.txt")
    public String https()  {
        return "201802261233415544hvi872a7agweaqjpeg1whxfo32p4jbutjcsgmp54mxyh1r";
    }


    @RequestMapping(value = "/login")
    public String login(){
        return "login";
    }

    @RequestMapping(value = "/")
    public String api_login(HttpServletRequest request){

        username=request.getRemoteUser();
        jsessionId=request.getSession().getId();
        jedis.set(jsessionId,username);
        return "funExam";
    }

    @RequestMapping(value = "/personal")
    public String personal() throws Exception {
        return "personal";
    }


    @RequestMapping("/admin_add")
    public String admin_add() throws Exception {
        return "admin_add";
    }

    @RequestMapping("/admin_publish")
    public String admin_publish() throws Exception {
        return "admin_publish";
    }

    @RequestMapping(value = "/onlineLib")
    @PreAuthorize("hasAnyRole('admin','user')")
    public String onlineLib() throws Exception {
        return "onlineLib";
    }

    @RequestMapping("/skill_chart")
    public String skill_chart() throws Exception {
        return "skill_chart";
    }

    @RequestMapping("/examinee_info")
    public String examinee_info() throws Exception {
        return "examinee_info";
    }

    @RequestMapping("/funExam")
    @PreAuthorize("hasAnyRole( 'user','admin')")//需要加前缀ROLE_
    public String funExam() throws Exception {
        return "funExam";
    }

    @RequestMapping("/404")
    public String forbidden(){
        return "404";
    }

    @RequestMapping("/practice_completed")
    public String practice_completed(){
        return "practice_completed";
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


    @RequestMapping(value = "/mailSender")
    @ResponseBody
    public String mailSender(@RequestParam(value = "email")String email, HttpServletRequest request){
        String random= RandomUtil.getRandom();
        request.getSession().setAttribute("email",email);
        try {
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
    public String answersSender(HttpServletRequest request,HttpServletResponse response){

        //获取当前jsessionId会话的record
        Record record=recordRepository.findByJsessionId(jsessionId);
        int score=0;
        List<PsdBack> chart=new ArrayList<>();

        //答题数不要之前的count，用更准确的答案个数来确定
        String answers=record.getAnswers();

        //使用自定义的一个字符串处理工具包来简化代码,好像没有效果？？
        String[] dd=stringUtil.stringToArray(answers);

        String anwserList[] = new String[dd.length];

        int rightSerial[]= new int[dd.length];

        for (int i = 0; i <dd.length ; i++) {
            anwserList[i]=request.getParameter(String.valueOf(i+1));
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

        //使用获取记录然后set参数的方法失效？？？
        //通过创建jpa的sql语句解决
        record.setAnswerList(Arrays.toString(anwserList));
        record.setScore(score);
        record.setRightSerial(Arrays.toString(rightSerial));
        record.setType(1);
        recordRepository.saveAndFlush(record);
        List<String> hh=recordRepository.findLangDetails(username);

        //处理返回给practice_result的数据
        //在处理返回给Psd页面的创建了psdBack类处理数据格式
        for (int i = 0; i < 4; i++) {
            psdBack=new PsdBack(lang[i],stringUtil.rightNumber(lang[i],hh),stringUtil.totalNumber(lang[i],hh));
            chart.add(psdBack);
        }
        long time=System.currentTimeMillis()-Long.parseLong(String.valueOf(jedis.hmget(jsessionId+"map","begin").get(0)));
        Map map=new HashMap();
        map.put("score",score);
        map.put("count",record.getCount());
        map.put("time",time);
        map.put("A",String.valueOf(jedis.hmget(jsessionId+"map","A").get(0)));
        map.put("B",String.valueOf(jedis.hmget(jsessionId+"map","B").get(0)));
        map.put("C",String.valueOf(jedis.hmget(jsessionId+"map","C").get(0)));
        map.put("D",String.valueOf(jedis.hmget(jsessionId+"map","D").get(0)));
        map.put("chart",chart);

//        jedis.set("map"+jsessionId,gson.toJson(map));
        return "/practice_completed";
    }

    @RequestMapping("/onlineLib_practice")
    public String onlineLib_practice() throws Exception {
        return "/onlineLib_practice";
    }

    @RequestMapping("/onlineLib_result")
    @ResponseBody
    public String onlineLib_result( HttpServletResponse response,HttpServletRequest request){

        username=jedis.get(request.getSession().getId());

        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
        response.addHeader("Access-Control-Max-Age", "1800");

        List<String> hh=recordRepository.findLangDetails(username);
        List<PsdBack> chart=new ArrayList<>();
        Map map=new HashMap();
        for (int i = 0; i < 4; i++) {
            psdBack=new PsdBack(lang[i],stringUtil.rightNumber(lang[i],hh),stringUtil.totalNumber(lang[i],hh));
            chart.add(psdBack);
        }

        map.put("A",String.valueOf(jedis.hmget(jsessionId+"map","A").get(0)));
        map.put("B",String.valueOf(jedis.hmget(jsessionId+"map","B").get(0)));
        map.put("C",String.valueOf(jedis.hmget(jsessionId+"map","C").get(0)));
        map.put("D",String.valueOf(jedis.hmget(jsessionId+"map","D").get(0)));
        map.put("chart",chart);
        return gson.toJson(map);
    }


    @ResponseBody
    @RequestMapping("/isLimit")
    public int isLimit() {
        return Integer.valueOf(jedis.get(jsessionId+"UserPaper"));
    }

    @ResponseBody
    @RequestMapping("/personalInfo")
    public String personalInfo() {
        int practiced=0;
        int tested=0;
//        user = userRepository.findByUsername(jedis.get(jsessionId));
        user = userRepository.findByUsername(username);
        List<String> hh=recordRepository.findLangDetails(user.getUsername());
        for (int i = 0; i < lang.length; i++) {
            practiced+= stringUtil.totalNumber(lang[i],hh);
        }
        if (String.valueOf(user.getRole()).equals("admin"))
            return "{\"name\":"+user.getUsername()+"\",\"email\":\""+user.getEmail()+"\",\"practiced\":\""+practiced+
                    "\",\"tested\":\""+0+"\",\"email\":\""+user.getEmail()+"\",\"isAdmin\":\"1\"}";
        else
            return  "{\"name\":"+user.getUsername()+"\",\"email\":\""+user.getEmail()+"\",\"practiced\":\""+0+
                    "\",\"tested\":\""+0+"\",\"email\":\""+user.getEmail()+"\",\"isAdmin\":\"0\"}";
    }
    

    @ResponseBody
    @RequestMapping("/userPaper")
    public String userPaper() {
        jedis.set(jsessionId+"UserPaper",String.valueOf(0));
        java.util.Date now = new java.util.Date();
        DateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        List<PaperInfo> list=paperInfoRepository.findAll();

        for (int i = 0; i < list.size(); i++) {
            String mix=list.get(i).getDate()+" "+list.get(i).getStartTime()+":00";
            System.out.println(mix);
            try {
                if (format.parse(mix).getTime()-600000< now.getTime()&&format.parse(mix).getTime()+1800000> now.getTime()) {

                    jedis.set(jsessionId+"UserPaper", String.valueOf(1));
                    user = userRepository.findByUsername(jedis.get(jsessionId));
                    paperInfo = list.get(i);

				return "{\"role\":\""+user.getRole()+"\",\"email\":\""+user.getEmail()+"\",\"username\":\""+user.getUsername()
                        + "\",\"examQuestion\":[" +
                        // paperInfo.getExamQuestion()
                        stringUtil.adjustFormat(paperInfo)
                        +"],\"startTime\":\""+paperInfo.getStartTime()
                        +"\",\"endTime\":\""+paperInfo.getEndTime()+"\",\"type\":\""+paperInfo.getType()+"\",\"info\":\""+
                        paperInfo.getName()+"\",\"token\":\""+paperInfo.getToken()+"\"}";
                }
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        return "error";

    }

    @RequestMapping("/exam_add")
    public void exam_add(HttpServletResponse response, @RequestParam(required = false,value = "examData")String examData){

        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
        response.addHeader("Access-Control-Max-Age","1800");

        //处理考试题目，并与试卷级联
        List<ExamQuestion> list=stringUtil.examCut(examData);
        for (int i = 0; i < list.size(); i++) {
            examQuestionRepository.save(list.get(i));
        }

        //处理获取试卷信息
        PaperInfo paperInfo=stringUtil.basicCut(examData,list);
        paperInfo.setUser(userRepository.findByUsername(username));
        paperInfoRepository.save(paperInfo);

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
        jedis.hmset(jsessionId+"map",map);

        //设置会话窗口的存活期
//       jedis.expire(jsessionId,Integer.parseInt(String.valueOf(360)));//设置由就session生成的查询条件map生存期

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
        String A= String.valueOf(jedis.hmget(jsessionId+"map","A").get(0));
        String B= String.valueOf(jedis.hmget(jsessionId+"map","B").get(0));
        String C= String.valueOf(jedis.hmget(jsessionId+"map","C").get(0));
        String D=String.valueOf(jedis.hmget(jsessionId+"map","D").get(0));
        Integer count= Integer.valueOf(jedis.hmget(jsessionId+"map","count").get(0));

        List<Question> list=questionRepository.find(A,B,C,D,count);

        //查询得到数据放在record题目类型列
        List<String> langList=questionRepository.findLang(A,B,C,D,count);

        //把查询出来的答案数组放在字符串answers中,不需要放入jedis去转运，关键设计在于使用好jsessionid
//        jedis.set(username + "answers",String.valueOf(questionRepository.findAnwserList(A,B,C,D,count)));
        String answers=String.valueOf(questionRepository.findAnwserList(A,B,C,D,count));

        //使用构造器来new新的record
        Record record=new Record(jsessionId,0,userRepository.findByUsername(username),list,-1,
                null,answers,null,count,langList.toString(),new Date(System.currentTimeMillis()));

        recordRepository.save(record);


        return list;
    }


    @ResponseBody
    @RequestMapping(value = "/add")
    public void add(@RequestParam(value = "type")String type,@RequestParam(value = "lang")String lang,
                                    @RequestParam(value = "info")String info,@RequestParam(value = "code")String code,
                                    @RequestParam(value = "choices")String choices){
        Question question=new Question(type,lang,info,code,choices, new Date(System.currentTimeMillis()));
        questionRepository.save(question);
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


}
