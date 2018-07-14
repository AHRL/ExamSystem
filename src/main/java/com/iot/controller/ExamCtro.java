package com.iot.controller;

import com.google.gson.Gson;
import com.iot.model.*;
import com.iot.repository.QuestionRepository;
import com.iot.repository.RecordRepository;
import com.iot.repository.UserRepository;
import com.iot.utils.RandomUtil;
import com.iot.utils.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
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
import java.sql.Date;
import java.text.DateFormat;
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

    private  Record  record;

    private static String jsessionId;

    private static String username;


    StringUtil  stringUtil=new StringUtil();

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private RecordRepository recordRepository;


    @RequestMapping(value = "/")
    @PreAuthorize("hasAnyRole( 'user','admin')")
    public String api_login(HttpServletRequest request){
        username=request.getRemoteUser();
        jsessionId=request.getSession().getId();
        jedis.set(jsessionId,username);
        return "funExam";
    }


    /**
     * 考试系统首页
     */
    @RequestMapping("/funExam")
    @PreAuthorize("hasAnyRole( 'user','admin')")
    public String funExam() {
        return "funExam";
    }


    /**
     * 用户登陆
     */
    @RequestMapping(value = "/login")
    public String login(){
        return "login";
    }


    /**
     * 用户个人中心
     */
    @RequestMapping(value = "/personal")
    public String personal() {
        return "personal";
    }


    /**
     * 管理员页面
     */
    @RequestMapping("/admin")
//    @PreAuthorize("hasAnyRole('admin')")
    public String admin() throws Exception {
        return "admin";
    }


    /**
     * 管理员添加试卷
     */
    @RequestMapping("/admin_add")
    @PreAuthorize("hasAnyRole('admin')")
    public String admin_add(){
        return "admin_add";
    }


    /**
     * 考试页面跳转
     */
    @RequestMapping(value = "/exam")
    public String exam(){
        return  "exam";
    }


    /**
     * 用户在线练题—选择页
     */
    @RequestMapping(value = "/onlineLib")
    @PreAuthorize("hasAnyRole('admin','user')")
    public String onlineLib(){
        return "select";
    }


    /**
     * 用户在线练题—答题页
     */
    @RequestMapping("/practice")
    public String onlineLib_practice() {
        return "practice";
    }


    /**
     * 练题练题结束评估页
     */
    @RequestMapping("/practice_completed")
    public String practice_completed(){
        return "practice_completed";
    }


    /**
     * 用户的技能图谱
     */
    @RequestMapping("/skill_chart")
    public String skill_chart() {
        return "skill_chart";
    }


    /**
     *
     * @return
     * 考生详情页
     */
    @RequestMapping("/examinee_info")
    public String examinee_info()  {
        return "examinee_info";
    }

//
    @RequestMapping("/404")
    public String forbidden(){
        return "404";
    }

    /**
     *
     * @return
     *
     */
    @RequestMapping("/exam_detail")
    public String exam_detail(){
        return "exam_detail";
    }



    /**
     *
     * @return
     * 练题阅览
     */
    @RequestMapping("/practice_detail")
    public String practice_detail()  {
        return "practice_detail";
    }


//
    @RequestMapping("/admin_publish")
    public String admin_publish() throws Exception {
        return "admin_publish";
    }


	/**
	 *
	 * @param request
	 * @param response
	 * @return
	 * 用户登出
	 */
	@RequestMapping(value = "/logout", method = RequestMethod.GET)
    public String logout(HttpServletRequest request, HttpServletResponse response){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return "login";
    }


    /**
     *
     * @return
     *
     * https证书配置，腾讯云颁发的ssl证书，服务器端通过nginx反向代理
     */
    @ResponseBody
    @RequestMapping("/.well-known/pki-validation/fileauth.txt")
    public String https()  {
        return "201802261233415544hvi872a7agweaqjpeg1whxfo32p4jbutjcsgmp54mxyh1r";
    }



	/**
	 *
	 * @param userAuthentication
	 * @param model
	 * @return
	 *
	 * 这是处理通过QQ快捷登陆的用户验证部分
	 *      使用了自己的回调地址，配置文件查看 filter.qq 目录
	 */
	@RequestMapping("/user")
	public String user(@AuthenticationPrincipal UsernamePasswordAuthenticationToken userAuthentication, Model model)
	{
		QQUser user = (QQUser) userAuthentication.getPrincipal();
		model.addAttribute("username", user.getNickname());
		model.addAttribute("avatar", user.getAvatar());
		return "funExam";

//        return "\"a1\\},{";
	}



    /***
     *
     * @param email
     * @param request
     * @return
     *
     * 调用了腾讯邮箱的SMTP服务
     *      实现注册的时候的发送注册验证码
     */
    @RequestMapping(value = "/api/getValCode",method = RequestMethod.POST,produces="text/plain;charset=UTF-8")
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
            return "{\"ret\":false}";
        }
        return  "{\"ret\":true,\"valCode\":\""+random+"\"}";
    }


    /**
     *
     * @param request
     * @return
     *
     * 阅卷+用户答题信息整理
     */
    @RequestMapping("/api/answersSender")
    public String answersSender(HttpServletRequest request){

        jsessionId=request.getSession().getId();

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

        jedis.set("map"+jsessionId,gson.toJson(map));
        return "/practice_completed";
    }


    /**
     *
     * @param response
     * @param request
     * @return
     *
     * 用户技能图谱的数据统计
     */
	@ResponseBody
    @RequestMapping("/api/onlineLib_result")
    public String onlineLib_result( HttpServletResponse response,HttpServletRequest request){

        username=request.getRemoteUser();

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


    /**
     * @param A
     * @param B
     * @param C
     * @param D
     * @param count
     * @param response
     * @param request
     * @return
     *
     * http://localhost/api/select?programmeA=HTML+CSS&&programmeB=Java&&programmeC=C&&programmeD=null&&count=15
     *
     * 根据自己数据库中提供的题目种类数来设置programme的个数
     *      需要更改question相关的查询语句
     * [programme:C/C++、Java、Javascript、HTML/CSS]
     *
     */
    @ResponseBody
    @RequestMapping("/api/select")
    public String select(@RequestParam(required = false,defaultValue = "null",value = "programmeA")String A,
                         @RequestParam(required = false,defaultValue = "null",value = "programmeB")String B,
                         @RequestParam(required = false,defaultValue = "null",value = "programmeC")String C,
                         @RequestParam(required = false,defaultValue = "null",value = "programmeD")String D,
                         @RequestParam(required = false,value = "count")String count,
                         HttpServletResponse response,HttpServletRequest request)  {
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
        response.addHeader("Access-Control-Max-Age", "1800");

        DateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        try
        {
            jsessionId=request.getSession().getId();

            //jedis的map来带值
            Map<String,String> map=new HashMap<>();
            map.put("A",A);
            map.put("B",B);
            map.put("C",C);
            map.put("D",D);
            map.put("count",count);
            map.put("startTime", String.valueOf(System.currentTimeMillis()));//答题练习的开始时间
            jedis.hmset(jsessionId+"map",map);

            //设置会话窗口的存活期
            jedis.expire(jsessionId,Integer.parseInt(String.valueOf(360)));//设置由就session生成的查询条件map生存期

        }catch (Exception e){
            System.err.println(e+"/api/select");
            return "{\"ret\":false}";
        }
        return  "{\"ret\":true}";
    }



    /**
     *
     * @param request
     * @param response
     * @return
     *
     * 返回当前时间开放的练题
     */
//    @RequestMapping(value = "/api/back",produces="application/json;charset=UTF-8")
    @RequestMapping(value = "/api/back",produces="plain/text;charset=UTF-8")
    @ResponseBody
    public String back(HttpServletRequest request,HttpServletResponse response){
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
        response.addHeader("Access-Control-Max-Age", "1800");

        jsessionId=request.getSession().getId();

        Integer count= Integer.valueOf(jedis.hmget(jsessionId+"map","count").get(0));


        List<Question> list=new ArrayList<>();
        List<Question> listA=new ArrayList<>();
        jsessionId=request.getSession().getId();
        String startTime=String.valueOf(jedis.hmget(jsessionId+"map","startTime").get(0));

        int ss=new Random().nextInt();

        try {

            String A= String.valueOf(jedis.hmget(jsessionId+"map","A").get(0));
            String B= String.valueOf(jedis.hmget(jsessionId+"map","B").get(0));
            String C= String.valueOf(jedis.hmget(jsessionId+"map","C").get(0));
            String D=String.valueOf(jedis.hmget(jsessionId+"map","D").get(0));


            list=questionRepository.find(A,B,C,D);

            int  rand= new Random().nextInt(list.size()-count);

            jedis.set(jsessionId+"random",String.valueOf(rand));


            for (int i = rand; i <list.size() ; i++) {
                listA.add(list.get(i));
                if (listA.size()==count)
                    break;
            }

            //查询得到数据放在record题目类型列
            List<String> langList=questionRepository.findLang(A,B,C,D);
            List<String> langListA=new ArrayList<>();
            for (int i = rand; i <langList.size() ; i++) {
                langListA.add(langList.get(i));
                if (langListA.size()==count)
                    break;
            }


            //把查询出来的答案数组放在字符串answers中,不需要放入jedis去转运，关键设计在于使用好jsessionid
            List<String> aa=questionRepository.findAnwserList(A,B,C,D);
            List<String> bb=new ArrayList<>();
            for (int i = rand; i <aa.size() ; i++) {
                bb.add(aa.get(i));
                if (bb.size()==count)
                    break;
            }


            String answersA = String.valueOf(bb);
            answersA.replace("','","").replace("\"['","").replace("']\"","");

            //使用构造器来new新的record
            Record record=new Record(jsessionId,0,userRepository.findByUsername(username),list,-1,
                    null,answersA,null,count,langListA.toString(),new Date(System.currentTimeMillis()));

            recordRepository.save(record);

        }catch (Exception e){
            System.err.println(e+"/api/back");
            e.printStackTrace();
            return "{\"ret\":false}";
        }

        return  "{\"ret\":true,\"data\":["+ stringUtil.toQuestionsString(listA)+"]}";
    }


    /**
     *
     * 提交练题
     * 阅卷+用户答题信息整理
     */
    @ResponseBody
    @RequestMapping(value = "/api/practice_submit")
    public String add(@RequestParam(value = "answers")String answers,HttpServletRequest request){

        jsessionId =request.getSession().getId();
        user=userRepository.findByUsername(jedis.get(jsessionId));

        List<Question> list=new ArrayList<>();
        List<Question> listA=new ArrayList<>();

        //使用自定义的一个字符串处理工具包来简化代码,好像没有效果？？
        String[] dd=stringUtil.stringToArray(answers);

        System.out.println(answers);

        int rand =Integer.valueOf(jedis.get(jsessionId+"random"));


        try{

            //获取当前jsessionId会话的record
            record =recordRepository.findByJsessionId(jsessionId);
            record.setAnswerList(answers);
            recordRepository.saveAndFlush(record);

            String A= String.valueOf(jedis.hmget(jsessionId+"map","A").get(0));
            String B= String.valueOf(jedis.hmget(jsessionId+"map","B").get(0));
            String C= String.valueOf(jedis.hmget(jsessionId+"map","C").get(0));
            String D=String.valueOf(jedis.hmget(jsessionId+"map","D").get(0));
            Integer count= Integer.valueOf(jedis.hmget(jsessionId+"map","count").get(0));
            list=questionRepository.find(A,B,C,D);
            for (int i = rand; i <list.size() ; i++) {
                listA.add(list.get(i));
                if (listA.size()==count)
                    break;
            }


        }catch (Exception e){
            e.printStackTrace();
            return "{\"ret\":false}";
        }
        return  "{\"success\":true,\"name\":\"" +user.getUsername()+
                    "\",\"data\":"+stringUtil.toPracticeFormat(listA,dd)+"}";
    }



    /**
     *
     * 最近七天注册人数
     */
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

}
