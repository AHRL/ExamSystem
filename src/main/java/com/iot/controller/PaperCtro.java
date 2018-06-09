package com.iot.controller;

import com.google.gson.Gson;
import com.iot.model.ExamQuestion;
import com.iot.model.PaperInfo;
import com.iot.model.PaperRecord;
import com.iot.model.User;
import com.iot.model.jsonObject.Basic;
import com.iot.model.jsonObject.Transfer;
import com.iot.repository.*;
import com.iot.utils.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
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

	private static  String lang[]=new String[]{"HTML+CSS","JavaScript","Java","C"};


	private static String jsessionId;

	private static PaperRecord paperRecord;

	private static String username;

	private Transfer transfer;

	private Basic basic;

	StringUtil stringUtil=new StringUtil();

	@Autowired
	private PaperRecordRepository paperRecordRepository;


	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ExamQuestionRepository examQuestionRepository;

	@Autowired
	private PaperInfoRepository paperInfoRepository;


	@ResponseBody
	@RequestMapping(value = "/api/ready_exam",method = RequestMethod.GET,produces="text/plain;charset=UTF-8")
	public String ready_exam(HttpServletRequest request){

		jsessionId =request.getSession().getId();

		java.util.Date now = new java.util.Date();
		DateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		List<PaperInfo> list=paperInfoRepository.findAll();

		for (int i = 0; i < list.size(); i++) {

			String mix=list.get(i).getDeadline()+":00";
			if (mix.length()<8) { mix="0"+ mix; }
			mix=list.get(i).getDate().replace("/","-")+" "+mix;

			try {
				if (format.parse(mix).getTime()+7200000<now.getTime()&&format.parse(mix).getTime()+9000000> now.getTime()){
					jedis.set(jsessionId+"PaperId",String.valueOf(list.get(i).getId()));
					jedis.expire(jsessionId+"PaperId",2400);

					return "{\"ret\":true,\"data\":{\"status\":\"OK\"}}";
				}
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		return "{\"ret\":false}";

	}



	/**
	 *
	 * @param request
	 * @return
	 *
	 * 查询当前用户的已考试卷和待考试卷
	 */
	@ResponseBody
	@RequestMapping(value = "/api/exam_detail")
	public String exam_detail(HttpServletRequest request) {

		jsessionId=request.getSession().getId();
		List<PaperRecord> examing = null;
		List<PaperRecord> examed = null;

		try{
			user = userRepository.findByUsername(jedis.get(jsessionId));
			examing = paperRecordRepository.findExamingPaperByUsername(user.getUsername());
			examed = paperRecordRepository.findExamedPaperByUsername(user.getUsername());
		}catch (Exception e){
			System.err.println(e+"/api/exam_detail");
			return "{\"ret\":false}";
		}
		return "{\"ret\":true,\"data\":{"+stringUtil.getExamedRecord(examed)+","+stringUtil.getExamingRecord(examing)+"}}";
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



	/**
	 *
	 * @param email
	 * @return
	 *
	 * 校验邮箱是否被注册过
	 */
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


	/**
	 *
	 * @param request
	 * @return
	 *
	 *
	 * 返回当前登陆用户的详细信息
	 */
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


	/**
	 *
	 * @return
	 *
	 * ？？？
	 */
	@ResponseBody
	@RequestMapping(value = "/api/getValCode",method = RequestMethod.GET,produces="text/plain;charset=UTF-8")
	public  String getValCode() {
		Boolean status =true;
		Long token=null;

		try {
			token = paperInfoRepository.findById(Long.valueOf(jedis.get(jsessionId+"PaperId"))).getId();
		}catch (Exception e){
			status=false;
			System.err.println(e+"/api/");
		}
		return status?"{\"ret\":true,\"data\":{\"valCode\":'" +token +"'}":"{\"ret\":false}";
	}



	/**
	 *
	 * @param request
	 * @return
	 *
	 * 获取当前开放的考试试卷
	 */
	@ResponseBody
	@RequestMapping(value = "/api/exam",method = RequestMethod.GET)
	public String exam(HttpServletRequest request) {

		jsessionId=request.getSession().getId();
		Boolean status =true;
		try{
			user = userRepository.findByUsername(jedis.get(jsessionId));
			paperInfo =paperInfoRepository.findById(Long.valueOf(jedis.get(jsessionId+"PaperId")));
		}catch (Exception e){
			status = false;}

		return status?"{\"ret\":true,\"time\":\"120\",\"data\":["+stringUtil.toExamQuestionsString(paperInfo.getExamQuestions()) +"]}":"{\"ret\":false}";


	}



	/**
	 *
	 * @param request
	 * @param paperAnswer
	 * @return
	 *
	 * 考生提交试卷
	 */
	@ResponseBody
	@RequestMapping(value = "/api/exam_submit",method = RequestMethod.POST)
	public  String exam_submit(HttpServletRequest request,@RequestParam(value = "paperAnswer") String paperAnswer) {

		jsessionId = request.getSession().getId();
		Long paperId=Long.valueOf(jedis.get(jsessionId+"PaperId"));
		user = userRepository.findByUsername(jedis.get(jsessionId));

		try{
			paperRecord=paperRecordRepository. findByPaperInfoAndName(paperId,user.getUsername());
			paperRecord.setPaperAnswer(paperAnswer);
			paperRecordRepository.saveAndFlush(paperRecord);
		}catch (Exception e){
			System.err.println(e+"/api/exam_submit");
			return "{\"ret\":false}";
		}

		return "{\"ret\":true,\"data\":[{\"status\":\"OK\"}]}";
	}



	/**
	 *
	 * @param request
	 * @param a    		试卷的paperInfo
	 * @param data 		试卷中的examQuestions
	 * @return
	 *
	 * 管理员权限添加考试试卷
	 * 		通过basic来转化拿到的paperInfo的数据，transfer来转化拿到的examQuestion数据
	 */
	@ResponseBody
	@RequestMapping(value = "/api/exam_add",method = RequestMethod.POST)
	public String exam_add(HttpServletRequest request,@RequestParam(value = "basic" ) String a,@RequestParam(value = "questions") String data) {

		jsessionId =request.getSession().getId();
		Boolean status=true;
		Gson gson =new Gson();
		List<ExamQuestion> list=new ArrayList<>();
		user=userRepository.findByUsername(jedis.get(jsessionId));

		try {

		//这里的gson、examQuestion都引入了局部声明，全局声明不到位？？？
		//处理字符串数据data，引入了一个中转类 有没有必要？
		String[] b=data.substring(2,data.length()-2).split("},\\{");

			for (int i = 0; i < b.length; i++) {
				transfer=gson.fromJson("{"+b[i]+"}",Transfer.class);
				ExamQuestion examQuestion=new ExamQuestion(new java.sql.Date(System.currentTimeMillis()),transfer.getType(),transfer.getDescribe(),transfer.getContent(),transfer.getScore());
				list.add(examQuestion);
				examQuestionRepository.save(examQuestion);
			}

			basic=gson.fromJson(a,Basic.class);

			//deadline的时间格式 23:59   date格式2018-01-18(2018/01/18)!
			paperInfo=new PaperInfo(basic.getDate(),basic.getDescribe(),user,basic.getLocation(),basic.getType(),basic.getTime(),false,basic.getDeadline());

			//保存试卷
			paperInfoRepository.save(paperInfo);

		}catch (Exception e){
			System.err.println(e+"/api/exam_add");
		}

		return 	status?"{\"ret\":true,\"data\":{\"status\":\"OK\"}}":"{\"ret\":false}";
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


	/***
	 *
	 * @param request
	 * @param id
	 * @return
	 *
	 * 用户报名考试
	 */
	@ResponseBody
	@RequestMapping( value = "/api/user_sign_for_exam",method = RequestMethod.POST)
	public  String user_sign_for_exam(HttpServletRequest request,@RequestParam(value = "token") Long id) {

		Boolean status=true;
		jsessionId=request.getSession().getId();
		try{
			paperInfo = paperInfoRepository.findById(id);
			user = userRepository.findByUsername(jedis.get(jsessionId));

			if (paperRecordRepository.findByPaperInfoAndName(id,user.getUsername())!=null){
				return "{\"ret\":false}";
			}

//			String date =paperInfo.getDate().replace("-","/")+" "+paperInfo.getStartTime()+"-"+paperInfo.getEndTime();
			String date=paperInfo.getDate()+" "+paperInfo.getTime();
			PaperRecord  paperRecord=new PaperRecord(user,paperInfo,0,paperInfo.getName(),paperInfo.getDeadline(),-1
					,date,paperInfo.getLocation(),new Date());
			paperRecordRepository.save(paperRecord);
		}catch (Exception e){
			status= false;
			System.err.println(e+"/api/user_sign_for_exam");
		}
		return status?"{\"ret\":true,\"data\":{\"status\":\"OK\"}}":"{\"ret\":false}";
	}


	/**
	 *
	 * @param request
	 * @param response
	 * @return
	 * 用户登出
	 */
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


	/***
	 *
	 * @param request
	 * @return
	 * 用户可以报名参加的考试列表
	 */
	@ResponseBody
	@RequestMapping(value = "/api/exam_list_for_sign",method = RequestMethod.GET,produces="text/plain;charset=UTF-8")
	public String exam_list_for_sign(HttpServletRequest request){

		jsessionId=request.getSession().getId();
		Boolean status =true;

		DateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		java.util.Date now = new java.util.Date();

		List<PaperInfo> list=paperInfoRepository.findAll();
		List<PaperInfo> a=new ArrayList<>();
		try{
			for (int i = 0; i < list.size(); i++) {

				String mix=list.get(i).getDeadline()+":00";
				if (mix.length()<8) { mix="0"+ mix; }
				mix=list.get(i).getDate().replace("/","-")+" "+mix;

				if (format.parse(mix).getTime() > now.getTime()) {
					list.get(i).setIsSigned(true);
					if (paperRecordRepository.findByPaperInfoAndName(list.get(i).getId(), user.getUsername()) == null) {
						list.get(i).setIsSigned(false);
					}
					a.add(list.get(i));
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


	/**
	 *
	 * @param request
	 * @return
	 * 用户马上进行考试的标题
	 * 好像没用的？
	 */
	@ResponseBody
	@RequestMapping(value = "/api/exam_title",method = RequestMethod.GET,produces="text/plain;charset=UTF-8")
	public  String exam_title(HttpServletRequest request) {

		jsessionId=request.getSession().getId();
		Boolean status =true;
		try{
			user = userRepository.findByUsername(jedis.get(jsessionId));
			paperInfo =paperInfoRepository.findById(Long.valueOf(jedis.get(jsessionId+"PaperId")));
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
