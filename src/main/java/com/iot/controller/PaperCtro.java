package com.iot.controller;

import com.iot.model.ExamQuestion;
import com.iot.model.PaperInfo;
import com.iot.model.PsdBack;
import com.iot.model.User;
import com.iot.repository.*;
import com.iot.utils.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import redis.clients.jedis.Jedis;

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

	private PaperInfo paperInfo;

	private PsdBack psdBack;

	private static  String lang[]=new String[]{"HTML+CSS","JavaScript","Java","C"};

	private ExamQuestion examQuestion;

	private static String jsessionId;

	private static String username;


	StringUtil stringUtil=new StringUtil();

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
	public String ready_exam() {

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
							paperInfo.getInfo()+"\",\"token\":\""+paperInfo.getToken()+"\"}";
				}
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		return "error";

	}




}
