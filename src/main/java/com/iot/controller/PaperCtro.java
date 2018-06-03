package com.iot.controller;

import com.google.gson.Gson;
import com.iot.model.*;
import com.iot.repository.*;
import com.iot.utils.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import redis.clients.jedis.Jedis;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by xiongxiaoyu
 * Data:2018/5/15
 * Time:21:21
 */

@Controller
public class PaperCtro {


	private Jedis jedis=new Jedis("118.89.36.125", 6379);

	private User user;

	private Gson gson;

	private PaperInfo paperInfo;

	private PsdBack psdBack;

	private static  String lang[]=new String[]{"HTML+CSS","JavaScript","Java","C"};

	private ExamQuestion examQuestion;

	private static String jsessionId;

	private static PaperRecord paperRecord;

	private static String username;

	private Transfer transfer;

//	private EventListenerComponent eventListenerComponent;

	StringUtil stringUtil=new StringUtil();

	@Autowired

	private PaperRecordRepository paperRecordRepository;

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
	@RequestMapping(value = "/api/ready_exam",method = RequestMethod.GET,produces="text/plain;charset=UTF-8")
	public String ready_exam(HttpServletRequest request){

		jsessionId =request.getSession().getId();

		java.util.Date now = new java.util.Date();
		DateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		List<PaperInfo> list=paperInfoRepository.findAll();

		for (int i = 0; i < list.size(); i++) {
			String mix=list.get(i).getDate()+" "+list.get(i).getStartTime()+":00";

			try {
				if (format.parse(mix).getTime()-600000< now.getTime()&&format.parse(mix).getTime()+1800000> now.getTime()) {

					jedis.set(jsessionId+"PaperCode",String.valueOf(list.get(i).getId()));
					jedis.expire(jsessionId+"PaperCode",2400);

					return "{\"ret\":true,\"data\":{\"status\":\"OK\"}}";
				}
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		return "{\"ret\":false}";

	}

	@RequestMapping(value = "exam")
	public String exam(){
		return "exam";
	}


	@ResponseBody
	@RequestMapping(value = "/api/exam_detail")
//	@RequestMapping(value = "/api/exam_detail",produces="application/json;charsetD=UTF-8")
	public String exam_detail(HttpServletRequest request) {

		jsessionId=request.getSession().getId();
		Boolean status =true;
		List<PaperRecord> examing = null;
		List<PaperRecord> examed = null;

		try{
			user = userRepository.findByUsername(jedis.get(jsessionId));
			examing = paperRecordRepository.findExamingPaperByUsername(user.getUsername());
			examed = paperRecordRepository.findExamedPaperByUsername(user.getUsername());
		}catch (Exception e){
			status = false;
			System.err.println(e+"/api/exam_detail");
		}
		return  status?"{\"ret\":true,\"data\":{"+stringUtil.getExamedRecord(examed)+","+stringUtil.getExamingRecord(examing)+"}}":"{\"ret\":false}";
	}



	@ResponseBody
	@RequestMapping(value = "/api/examed_detail")
	public String examed_detail(){

		return "{\n"+
				"\"ret\":true,\n"+
				"\"data\":{\n"+
				"\"chart\":{\n"+
				"\"type\":\"column\"\n"+
				"},\n"+
				"\"title\":{\n"+
				"\"text\":\"已考试卷\"\n"+
				"},\n"+
				"\"subtitle\":{\n"+
				"\"text\":\"数据截止2018-05\"\n"+
				"},\n"+
				"\"xAxis\":{\n"+
				"\"type\":\"category\",\n"+
				"\"labels\":{\n"+
				"\"rotation\":\"-45//设置轴标签旋转角度\"\n"+
				"}\n"+
				"},\n"+
				"\"yAxis\":{\n"+
				"\"min\":0,\n"+
				"\"title\":{\n"+
				"\"text\":\"参考人数(人)\"\n"+
				"}\n"+
				"},\n"+
				"\"legend\":{\n"+
				"\"enabled\":false\n"+
				"},\n"+
				"\"tooltip\":{\n"+
				"\"pointFormat\":\"参考人数\":\"<b>{point.y}人次</b>\"\n"+
				"},\n"+
				"series:[{\n"+
				"name:\"总人数\",\n"+
				"data:[\n"+
				"[\"上海\",24],\n"+
				"[\"卡拉奇\",23],\n"+
				"[\"北京\",21],\n"+
				"[\"德里\",16],\n"+
				"[\"拉各斯\",16],\n"+
				"[\"天津\",15],\n"+
				"[\"伊斯坦布尔\",14],\n"+
				"[\"东京\",13],\n"+
				"[\"广州\",13],\n"+
				"[\"孟买\",12],\n"+
				"[\"莫斯科\",12],\n"+
				"[\"圣保罗\",12],\n"+
				"[\"深圳\",10],\n"+
				"[\"雅加达\",10],\n"+
				"[\"拉合尔\",10],\n"+
				"[\"首尔\",9],\n"+
				"[\"武汉\",9],\n"+
				"[\"金沙萨\",9],\n"+
				"[\"开罗\",9],\n"+
				"[\"墨西哥\",8]\n"+
				"],\n"+
				"dataLabels:{\n"+
				"enabled:true,\n"+
				"rotation:-90,\n"+
				"color:\"#FFFFFF\",\n"+
				"align:\"right\",\n"+
				"//format:\"{point.y:.1f}\",//:.1f为保留1位小数\n"+
				"y:10\n"+
				"}\n"+
				"}]\n"+
				"}\n"+
				"}";

	}


	@ResponseBody
	@RequestMapping(value = "/api/isExist",method = RequestMethod.GET,produces="text/plain;charset=UTF-8")
	public String isExist(@RequestParam(value = "email")String email) {

		Boolean status =true;
		Boolean isExist = true;
		try {
			isExist=userRepository.findByEmail(email)!=null;
		}catch (Exception e){
			status=false;
			System.err.println(e+"/api/isExist");
		}

		return  status?"{\"ret\":true,\"date\":{\"isExist\":\""+isExist+"\"}}":"{\"ret\":false}";

	}


	//这里的userInfo应该是注册用户信息还是登陆考试的用户的信息  ！！必须登陆才行
	@ResponseBody
	@RequestMapping(value = "/api/userinfo",method = RequestMethod.GET,produces="text/plain;charset=UTF-8")
	public  String userinfo(HttpServletRequest request) {
		request.getRemoteUser();
		Boolean status =true;
		jsessionId =request.getSession().getId();
		try {
//			user=userRepository.findByUsername(jedis.get(jsessionId));
			user=userRepository.findByUsername(request.getRemoteUser());
		}catch (Exception e){
			status=false;
			System.err.println(e+"/api/userinfo");
		}
		return status?"{\"ret\":true,\"data\":"+ user.userInfo() +"}":"{\"ret\":false}";

	}


	@ResponseBody
	@RequestMapping(value = "/api/getValCode",method = RequestMethod.GET,produces="text/plain;charset=UTF-8")
	public  String getValCode() {
		Boolean status =true;
		String token=null;

		try {
			token = paperInfoRepository.findById(Long.valueOf(jedis.get(jsessionId+"PaperCode"))).getToken();
		}catch (Exception e){
			status=false;
			System.err.println(e+"/api/");
		}
		return status?"{\"ret\":true,\"data\":{\"valCode\":'" +token +"'}":"{\"ret\":false}";
	}


	@ResponseBody
	@RequestMapping(value = "/api/exam",method = RequestMethod.GET)
	public String exam(HttpServletRequest request) {

		jsessionId=request.getSession().getId();
		Boolean status =true;
		try{
			user = userRepository.findByUsername(jedis.get(jsessionId));
			paperInfo =paperInfoRepository.findById(Long.valueOf(jedis.get(jsessionId+"PaperCode")));
		}catch (Exception e){
			status = false;}

		return status?"{\"ret\":true,\"time\":\""+ (Integer.valueOf(paperInfo.getTime())/60000)+"\",\"data\":["+stringUtil.toExamQuestionsString(paperInfo.getExamQuestions()) +"]}":"{\"ret\":false}";


	}


	@ResponseBody
	@RequestMapping(value = "/api/exam_submit",method = RequestMethod.POST)
	public  String exam_submit(HttpServletRequest request,@RequestParam(value = "paperAnswer") String paperAnswer,@RequestParam(value = "token")String token) {

		Boolean status =true;
		jsessionId = request.getSession().getId();
		user = userRepository.findByUsername(jedis.get(jsessionId));

		try{
			paperRecord=paperRecordRepository. findByTokenAndName(token,user.getUsername());
			paperRecord.setPaperAnswer(paperAnswer);
			paperRecordRepository.saveAndFlush(paperRecord);
		}catch (Exception e){
			System.err.println(e+"/api/");
			status=false;
		}

		return status?"{\"ret\":true,\"data\":[{\"status\":\"OK\"}]}":"{\"ret\":false}";
	}


	@ResponseBody
	@RequestMapping(value = "/api/exam_add",method = RequestMethod.POST)
	public String exam_add(HttpServletRequest request,@RequestParam(value = "token" ) String token,@RequestParam(value = "deadline") String deadline
			,@RequestParam(value = "time") String time,@RequestParam(value = "name") String name,@RequestParam(value = "date") String date
			,@RequestParam(value = "type") String type,@RequestParam(value = "location") String location
			,@RequestParam(value = "startTime") String startTime,@RequestParam(value = "endTime") String endTime
						   ,@RequestParam(value = "data") String data) throws InterruptedException {
		//处理ExamQuestions

		//这里的gson、examQuestion都引入了局部声明，全局声明不到位？？？
		Gson gson =new Gson();

		//处理字符串数据data，引入了一个中转类 有没有必要？
		String[] b=data.substring(2,data.length()-2).split("},\\{");
		List<ExamQuestion> list=new ArrayList<>();
		for (int i = 0; i < b.length; i++) {
			transfer=gson.fromJson("{"+b[i]+"}",Transfer.class);
			ExamQuestion examQuestion=new ExamQuestion(new java.sql.Date(System.currentTimeMillis()),transfer.getType(),transfer.getDescribe(),transfer.getContent());
			list.add(examQuestion);
			examQuestionRepository.save(examQuestion);
		}

		jsessionId =request.getSession().getId();
		Boolean status=true;
		user=userRepository.findByUsername(jedis.get(jsessionId));

		try {
			//deadline的时间格式2018/6/14 23:59   date格式2018-01-18(2018/01/18)
			paperInfo=new PaperInfo(date,name,user,startTime,location,endTime,type,time,token,false,deadline);
			//保存试卷
			paperInfoRepository.save(paperInfo);

		}catch (Exception e){
			System.err.println(e+"/api/exam_add");
		}

		return 	status?"{\"ret\":true}":"{\"ret\":false}";
	}



	@ResponseBody
	@RequestMapping(value = "/api/exam_sign_detail",method = RequestMethod.GET,produces="text/plain;charset=UTF-8")
	public  String exam_sign_detail() {

		return "{\n"+
				"ret:true,\n"+
				"data:{\n"+
				"chart:{\n"+
				"type:'bar'\n"+
				"},\n"+
				"title:{\n"+
				"text:'待考试卷/报名人数'\n"+
				"},\n"+
				"subtitle:{\n"+
				"text:'数据截止：2018-05-15'\n"+
				"},\n"+
				"xAxis:{\n"+
				"categories:['C','招新'],\n"+
				"title:{\n"+
				"text:null\n"+
				"}\n"+
				"},\n"+
				"yAxis:{\n"+
				"min:0,\n"+
				"title:{\n"+
				"text:'报名人数(人)',\n"+
				"align:'high'\n"+
				"},\n"+
				"labels:{\n"+
				"overflow:'justify'\n"+
				"}\n"+
				"},\n"+
				"tooltip:{\n"+
				"valueSuffix:'人次'\n"+
				"},\n"+
				"plotOptions:{\n"+
				"bar:{\n"+
				"dataLabels:{\n"+
				"enabled:true,\n"+
				"allowOverlap:true//允许数据标签重叠\n"+
				"}\n"+
				"}\n"+
				"},\n"+
				"legend:{\n"+
				"layout:'vertical',\n"+
				"align:'right',\n"+
				"verticalAlign:'top',\n"+
				"x:-40,\n"+
				"y:100,\n"+
				"floating:true,\n"+
				"borderWidth:1,\n"+
				"backgroundColor:'#FFFFFF',\n"+
				"shadow:true\n"+
				"},\n"+
				"series:[{\n"+
				"name:'2018年',\n"+
				"data:[11,99]\n"+
				"}]\n"+
				"}\n"+
				"}";

	}




	@ResponseBody
	@RequestMapping(value = "/api/exam_categroy",method = RequestMethod.GET,produces="text/plain;charset=UTF-8")
	public  String exam_categroy(){
		return "{\n"+
				"ret:true,\n"+
				"data:{\n"+
				"title:{\n"+
				"text:'试卷分类'\n"+
				"},\n"+
				"tooltip:{\n"+
				"headerFormat:'{series.name}<br>',\n"+
				"pointFormat:'{point.name}:<b>{point.percentage:.1f}%</b>'\n"+
				"},\n"+
				"plotOptions:{\n"+
				"pie:{\n"+
				"allowPointSelect:true,\n"+
				"cursor:'pointer',\n"+
				"dataLabels:{\n"+
				"enabled:false\n"+
				"},\n"+
				"showInLegend:true//设置饼图是否在图例中显示\n"+
				"}\n"+
				"},\n"+
				"series:[{\n"+
				"type:'pie',\n"+
				"name:'试卷类型占比',\n"+
				"data:[\n"+
				"['数据结构',22.0],\n"+
				"['web前端',26.8],\n"+
				"{\n"+
				"name:'C语言',\n"+
				"y:12.8,\n"+
				"sliced:true,\n"+
				"selected:true\n"+
				"},\n"+
				"['web后端',8.5],\n"+
				"['Android',6.2],\n"+
				"['嵌入式',23.7]\n"+
				"]\n"+
				"}]\n"+
				"}\n"+
				"}";
	}


	//用户报名考试
	@ResponseBody
	@RequestMapping( value = "/api/user_sign_for_exam",method = RequestMethod.POST)
	public  String user_sign_for_exam(HttpServletRequest request,@RequestParam(value = "token") String token) {

		Boolean status=true;
		jsessionId=request.getSession().getId();
		try{
			paperInfo = paperInfoRepository.findByToken(token);
			user = userRepository.findByUsername(jedis.get(jsessionId));

			if (paperRecordRepository.findByTokenAndName(token,user.getUsername())!=null){
				return "{\"ret\":false}";
			}

			String date =paperInfo.getDate().replace("-","/")+" "+paperInfo.getStartTime()+"-"+paperInfo.getEndTime();
			PaperRecord  paperRecord=new PaperRecord(user,paperInfo,0,token,paperInfo.getName(),paperInfo.getDeadline(),-1
					,date,paperInfo.getLocation(),new Date());
			paperRecordRepository.save(paperRecord);
		}catch (Exception e){
			status= false;
			System.err.println(e+"/api/user_sign_for_exam");
		}
		return status?"{\"ret\":true,\"data\":{\"status\":\"OK\"}}":"{\"ret\":false}";
	}


	@ResponseBody
	@RequestMapping(value = "/api/logout",method = RequestMethod.GET,produces="text/plain;charset=UTF-8")
	public String logout(HttpServletRequest request, HttpServletResponse response){
		Boolean status =true;

		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (auth != null) {
				new SecurityContextLogoutHandler().logout(request, response, auth);
			}
		}catch (Exception e){
			status =false;
			System.err.println(e+"/api/logout");
		}
		return status?"{\"ret\":true}":"{\"ret\":false}";
	}


	@ResponseBody
	@RequestMapping(value = "/api/login",method = RequestMethod.GET,produces="text/plain;charset=UTF-8")
	public String isLogin(){

		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (auth!=null){
				return "\"ret\":true";
			}
		}catch (Exception e){
			System.out.println(e+"/api/login");
		}

		return "\"ret\":false";
	}



	//用户可以报名参加的考试列表
	@ResponseBody
	@RequestMapping(value = "/api/exam_list_for_sign",method = RequestMethod.GET,produces="text/plain;charset=UTF-8")
	public String exam_list_for_sign(HttpServletRequest request){

		jsessionId=request.getSession().getId();
		Boolean status =true;
		java.util.Date now = new java.util.Date();
		DateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		List<PaperInfo> list=paperInfoRepository.findAll();
		List<PaperInfo> a=list;
		try{
			for (int i = 0; i < list.size(); i++) {
				String mix=list.get(i).getDeadline().replace("/","-")+":00";
				a.get(i).setIsSigned(false);
				if (format.parse(mix).getTime() > now.getTime()) {
					if (paperRecordRepository.findByTokenAndName(list.get(i).getToken(), user.getUsername()) != null) {
						a.get(i).setIsSigned(true);
					}
					a.remove(i);
				}

			}

			return "{\"ret\":true,\"data\":["+stringUtil.getExamingPaper(a)+"]}";

		}catch (ParseException e){
			System.err.println(e+"/api/exam_list_for_sign");
			e.printStackTrace();
			status=false;
		}
		return "{\"ret\":false}";
	}


	//用户马上进行考试的标题
	@ResponseBody
	@RequestMapping(value = "/api/exam_title",method = RequestMethod.GET,produces="text/plain;charset=UTF-8")
	public  String exam_title(HttpServletRequest request) {

		jsessionId=request.getSession().getId();
		Boolean status =true;
		try{
			user = userRepository.findByUsername(jedis.get(jsessionId));
			paperInfo =paperInfoRepository.findById(Long.valueOf(jedis.get(jsessionId+"PaperCode")));
		}catch (Exception e){
			System.err.println(e+"/api/exam_title");
			status = false;
		}

		return status?"\"ret\":true,\"data\":[" +paperInfo.toBeExaming()+"]}":"\"ret\":false";

	}

	@RequestMapping(value = "/api/register", method = RequestMethod.POST)
	public String register(HttpServletRequest request) throws Exception {
		String Username = request.getParameter("upUsername");
		String Password = request.getParameter("upPassword");
		String Email = request.getParameter("upEmail");
		request.getSession().setAttribute("Username", Username);
		User user = new User(Username, Password, Email, new java.sql.Date(System.currentTimeMillis()));
		user.setRole(User.ROLE.ROLE_user);
		userRepository.save(user);
		return "/funExam";
	}


}
