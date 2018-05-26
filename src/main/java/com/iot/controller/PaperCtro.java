package com.iot.controller;

import com.google.gson.Gson;
import com.iot.model.*;
import com.iot.repository.*;
import com.iot.utils.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import redis.clients.jedis.Jedis;

import javax.servlet.http.HttpServletRequest;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
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
	@RequestMapping(value = "/api/ready_exam",method = RequestMethod.GET)
	public String ready_exam(HttpServletRequest request){

		jsessionId =request.getSession().getId();
		Boolean status =false;
		java.util.Date now = new java.util.Date();
		DateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		List<PaperInfo> list=paperInfoRepository.findAll();

		for (int i = 0; i < list.size(); i++) {
			String mix=list.get(i).getDate()+" "+list.get(i).getStartTime()+":00";
//System.out.println(mix);
			try {
				if (format.parse(mix).getTime()-600000< now.getTime()&&format.parse(mix).getTime()+1800000> now.getTime()) {
//System.out.println(list.get(i).getId() + jsessionId);
					jedis.set(jsessionId+"PaperCode",String.valueOf(list.get(i).getId()));
					jedis.expire(jsessionId+"PaperCode",2400);
					status=true;
					return "{ret:"+status+",data:{status:'OK'}";
				}
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		return "{ret:"+status+"}";

	}


	//shame
	@ResponseBody
	@RequestMapping(value = "/api/exam_detail",method = RequestMethod.GET)
	public String exam_detail(HttpServletRequest request) {
		jsessionId=request.getSession().getId();
		Boolean status =true;
		List<PaperRecord> examing = null;
		List<PaperRecord> examed = null;

		try{
			user = userRepository.findByUsername(jedis.get(jsessionId));

//			examing = paperRecordRepository.findExamingPaperByUsername(user.getUsername());
			examed = paperRecordRepository.findExamedPaperByUsername(user.getUsername());

//			String a=Arrays.toString();

			Arrays.asList(examed.toArray());


//	System.out.println(stringUtil.stringToExamed(examed));

//			for (Iterator iterator = examed.iterator(); iterator.hasNext();){
//				String a= (String) iterator.next();
//				System.out.println(a);
//			}

		}catch (Exception e){
			status = false;
			System.err.println(e);
		}
		return  status?"{ret:true,date:{"+examed+"}}":"{ret:false}";

	}


	@ResponseBody
	@RequestMapping(value = "/api/isExist",method = RequestMethod.GET)
	public String isExist(@RequestParam(value = "email")String email) {

		Boolean status =true;
		Boolean isExist = true;
		try {
			isExist=userRepository.findByEmail(email)!=null;
		}catch (Exception e){
			status=false;
			System.err.println(e);
		}

		return  status?"{ret:true,date:{isExist:"+isExist+"}}":"{ret:false}";

	}


	//这里的userInfo应该是注册用户信息还是登陆考试的用户的信息  ！！必须登陆才行
	@ResponseBody
	@RequestMapping(value = "/api/userinfo",method = RequestMethod.GET)
	public  String userinfo() {
		return "1";
	}


	@ResponseBody
	@RequestMapping(value = "/api/getValCode",method = RequestMethod.GET)
	public  String getValCode() {

		return "{ret:true,data:{valCode:'"
				+paperInfoRepository.findById(Long.valueOf(jedis.get(jsessionId+"PaperCode"))).getToken()
				+"'}";
	}


	@ResponseBody
	@RequestMapping(value = "/api/exam",method = RequestMethod.GET)
	public String exam(HttpServletRequest request) {

		jsessionId=request.getSession().getId();
		Boolean status =true;
		try{
			user = userRepository.findByUsername(jedis.get(jsessionId));
			paperInfo =paperInfoRepository.findById(Long.valueOf(jedis.get(jsessionId+"PaperCode")));
		}catch (Exception e){status = false;}

		return "{ret:"+status+",time:'"+ (Integer.valueOf(paperInfo.getTime())/60000)+"',data:"+paperInfo.getExamQuestions().toString() +"}";
	}


	@ResponseBody
	@RequestMapping(value = "/api/exam_submit",method = RequestMethod.GET)
	public  String exam_submit(HttpServletRequest request,@RequestParam(value = "paperAnswer") String paperAnswer,@RequestParam(value = "token")String token) {

		Boolean status =true;
		jsessionId = request.getSession().getId();
		user = userRepository.findByUsername(jedis.get(jsessionId));

		try{
			paperRecord=paperRecordRepository.findByTokenAndName(token,user.getUsername());
			paperRecord.setPaperAnswer(paperAnswer);
			paperRecordRepository.saveAndFlush(paperRecord);
		}catch (Exception e){
			System.err.println(e);
			status=false;
		}

		return status?"{ret:"+ true +",data:[{status:'OK'}]}":"{ret:"+ false +"}";
	}


	//用户考试报名
	@ResponseBody
	@RequestMapping( value = "/api/user_sign_for_exam",method = RequestMethod.GET)
	public  String user_sign_for_exam(HttpServletRequest request,@RequestParam(value = "token") String token) {

		Boolean status=true;
		jsessionId=request.getSession().getId();

		try{
			paperInfo = paperInfoRepository.findByToken(token);
			user = userRepository.findByUsername(jedis.get(jsessionId));
			String date =paperInfo.getDate().replace("-","/")+" "+paperInfo.getStartTime()+"-"+paperInfo.getEndTime();
System.out.println(date);
			PaperRecord  paperRecord=new PaperRecord(user,paperInfo,0,token,paperInfo.getName(),"deadline",-1
					,date,paperInfo.getLocation());
			paperRecordRepository.save(paperRecord);
		}catch (Exception e){
			status= false;
		}

		return "{ret:"+status+"}";
	}

	@ResponseBody
	@RequestMapping(value = "/api/exam_list_for_sign",method = RequestMethod.GET)
	public  String exam_list_for_sign() {
		return "{\n" +
				"        ret: true," +
				"        data: [{" +
				"            name: '翼灵招新考试'," +
				"            date: '2018/06/15 15:00-17:00'," +
				"            deadline: '2018/6/14 23:59'," +
				"            loc: '明理楼B404'" +
				"        }]" +"dd"+
				"    }";
	}


}
