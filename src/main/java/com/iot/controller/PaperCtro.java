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


	@ResponseBody
	@RequestMapping(value = "/api/exam_detail",method = RequestMethod.GET)
	public String exam_detail(HttpServletRequest request) {
		jsessionId=request.getSession().getId();
		Boolean status =true;
		List<PaperRecord> examing = null;
		List<PaperRecord> examed = null;
		try{
			user = userRepository.findByUsername(jedis.get(jsessionId));
			examing = paperRecordRepository.findExamingPaperByUsername(user.getUsername());
			examed = paperRecordRepository.findExamedPaperByUsername(user.getUsername());
//			Arrays.asList(examed.toArray());

		}catch (Exception e){
			status = false;
			System.err.println(e);
		}
		return  status?"{ret:true,date:{"+stringUtil.getExamedRecord(examed)+","+stringUtil.getExamingRecord(examing)+"}}":"{ret:false}";
	}


	@ResponseBody
	@RequestMapping(value = "/api/examed_detail")
	public String examed_detail(){

		return "{\n" +
				"        ret: true,\n" +
				"        data: {\n" +
				"            chart: {\n" +
				"                type: 'column'\n" +
				"            },\n" +
				"            title: {\n" +
				"                text: '已考试卷'\n" +
				"            },\n" +
				"            subtitle: {\n" +
				"                text: '数据截止 2018-05'\n" +
				"            },\n" +
				"            xAxis: {\n" +
				"                type: 'category',\n" +
				"                labels: {\n" +
				"                    rotation: -45  // 设置轴标签旋转角度\n" +
				"                }\n" +
				"            },\n" +
				"            yAxis: {\n" +
				"                min: 0,\n" +
				"                title: {\n" +
				"                    text: '参考人数 (人)'\n" +
				"                }\n" +
				"            },\n" +
				"            legend: {\n" +
				"                enabled: false\n" +
				"            },\n" +
				"            tooltip: {\n" +
				"                pointFormat: '参考人数: <b>{point.y} 人次</b>'\n" +
				"            },\n" +
				"            series: [{\n" +
				"                name: '总人数',\n" +
				"                data: [\n" +
				"                    ['上海', 24],\n" +
				"                    ['卡拉奇', 23],\n" +
				"                    ['北京', 21],\n" +
				"                    ['德里', 16],\n" +
				"                    ['拉各斯', 16],\n" +
				"                    ['天津', 15],\n" +
				"                    ['伊斯坦布尔', 14],\n" +
				"                    ['东京', 13],\n" +
				"                    ['广州', 13],\n" +
				"                    ['孟买', 12],\n" +
				"                    ['莫斯科', 12],\n" +
				"                    ['圣保罗', 12],\n" +
				"                    ['深圳', 10],\n" +
				"                    ['雅加达', 10],\n" +
				"                    ['拉合尔', 10],\n" +
				"                    ['首尔', 9],\n" +
				"                    ['武汉', 9],\n" +
				"                    ['金沙萨', 9],\n" +
				"                    ['开罗', 9],\n" +
				"                    ['墨西哥', 8]\n" +
				"                ],\n" +
				"                dataLabels: {\n" +
				"                    enabled: true,\n" +
				"                    rotation: -90,\n" +
				"                    color: '#FFFFFF',\n" +
				"                    align: 'right',\n" +
				"                    // format: '{point.y:.1f}', // :.1f 为保留 1 位小数\n" +
				"                    y: 10\n" +
				"                }\n" +
				"            }]\n" +
				"        }\n" +
				"    }";

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
	public  String userinfo(HttpServletRequest request) {
		Boolean status =true;
		jsessionId =request.getSession().getId();
		try {
			user=userRepository.findByUsername(jedis.get(jsessionId));
		}catch (Exception e){
			status=false;
			System.err.println(e);
		}
		return status?"{ret:true,date:"+user.userInfo()+"}}":"{ret:false}";
	}


	@ResponseBody
	@RequestMapping(value = "/api/getValCode",method = RequestMethod.GET)
	public  String getValCode() {
		Boolean status =true;
		String token=null;

		try {
			token = paperInfoRepository.findById(Long.valueOf(jedis.get(jsessionId+"PaperCode"))).getToken();
		}catch (Exception e){
			status=false;
			System.err.println(e);
		}
		return status?"{ret:true,data:{valCode:'" +token +"'}":"{ret:false}";
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

		return status?"{ret:true,time:'"+ (Integer.valueOf(paperInfo.getTime())/60000)+"',data:"+paperInfo.getExamQuestions().toString() +"}":"{ret:false}";
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

		return status?"{ret:true,data:[{status:'OK'}]}":"{ret:false}";
	}


	@ResponseBody
	@RequestMapping(value = "/api/exam_add",method = RequestMethod.GET)
	public String exam_add(HttpServletRequest request){
		jsessionId =request.getSession().getId();
		Boolean status=true;
		user=userRepository.findByUsername(jedis.get(jsessionId));

		try {


		}catch (Exception e){
			System.err.println(e);
		}

		return 	status?"{ret:true}":"{ret:false}";
	}



	@ResponseBody
	@RequestMapping(value = "/api/exam_sign_detail",method = RequestMethod.GET)
	public  String exam_sign_detail() {

		return "{\n" +
				"        ret: true,\n" +
				"        data: {\n" +
				"            chart: {\n" +
				"                type: 'bar'\n" +
				"            },\n" +
				"            title: {\n" +
				"                text: '待考试卷/报名人数'\n" +
				"            },\n" +
				"            subtitle: {\n" +
				"                text: '数据截止：2018-05-15'\n" +
				"            },\n" +
				"            xAxis: {\n" +
				"                categories: ['C', '招新'],\n" +
				"                title: {\n" +
				"                    text: null\n" +
				"                }\n" +
				"            },\n" +
				"            yAxis: {\n" +
				"                min: 0,\n" +
				"                title: {\n" +
				"                    text: '报名人数 (人)',\n" +
				"                    align: 'high'\n" +
				"                },\n" +
				"                labels: {\n" +
				"                    overflow: 'justify'\n" +
				"                }\n" +
				"            },\n" +
				"            tooltip: {\n" +
				"                valueSuffix: ' 人次'\n" +
				"            },\n" +
				"            plotOptions: {\n" +
				"                bar: {\n" +
				"                    dataLabels: {\n" +
				"                        enabled: true,\n" +
				"                        allowOverlap: true // 允许数据标签重叠\n" +
				"                    }\n" +
				"                }\n" +
				"            },\n" +
				"            legend: {\n" +
				"                layout: 'vertical',\n" +
				"                align: 'right',\n" +
				"                verticalAlign: 'top',\n" +
				"                x: -40,\n" +
				"                y: 100,\n" +
				"                floating: true,\n" +
				"                borderWidth: 1,\n" +
				"                backgroundColor: '#FFFFFF',\n" +
				"                shadow: true\n" +
				"            },\n" +
				"            series: [{\n" +
				"                name: '2018 年',\n" +
				"                data: [11, 99]\n" +
				"            }]\n" +
				"        }\n" +
				"    }";

	}





	@ResponseBody
	@RequestMapping(value = "/api/exam_categroy",method = RequestMethod.GET)
	public  String exam_categroy(){
		return "{\n" +
				"        ret: true,\n" +
				"        data: {\n" +
				"            title: {\n" +
				"                text: '试卷分类'\n" +
				"            },\n" +
				"            tooltip: {\n" +
				"                headerFormat: '{series.name}<br>',\n" +
				"                pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'\n" +
				"            },\n" +
				"            plotOptions: {\n" +
				"                pie: {\n" +
				"                    allowPointSelect: true,\n" +
				"                    cursor: 'pointer',\n" +
				"                    dataLabels: {\n" +
				"                        enabled: false\n" +
				"                    },\n" +
				"                    showInLegend: true // 设置饼图是否在图例中显示\n" +
				"                }\n" +
				"            },\n" +
				"            series: [{\n" +
				"                type: 'pie',\n" +
				"                name: '试卷类型占比',\n" +
				"                data: [\n" +
				"                    ['数据结构',   22.0],\n" +
				"                    ['web 前端',       26.8],\n" +
				"                    {\n" +
				"                        name: 'C语言',\n" +
				"                        y: 12.8,\n" +
				"                        sliced: true,\n" +
				"                        selected: true\n" +
				"                    },\n" +
				"                    ['web 后端',    8.5],\n" +
				"                    ['Android',     6.2],\n" +
				"                    ['嵌入式',   23.7]\n" +
				"                ]\n" +
				"            }]\n" +
				"        }\n" +
				"    }";
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
			PaperRecord  paperRecord=new PaperRecord(user,paperInfo,0,token,paperInfo.getName(),"deadline",-1
					,date,paperInfo.getLocation());
			paperRecordRepository.save(paperRecord);
		}catch (Exception e){
			status= false;
			System.err.println(e);
		}
		return status?"{ret:true}":"{ret:false}";
	}

	@ResponseBody
	@RequestMapping(value = "/api/logout",method = RequestMethod.GET)
	public String logout(HttpServletRequest request, HttpServletResponse response){
		Boolean status =true;

		try {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (auth != null) {
				new SecurityContextLogoutHandler().logout(request, response, auth);
			}
		}catch (Exception e){
			status =false;
			System.err.println(e);
		}
		return status?"{ret:true}":"{ret:false}";
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
				"        }]" +
				"    }";
	}


}
