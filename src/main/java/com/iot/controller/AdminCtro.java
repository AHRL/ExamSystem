package com.iot.controller;

import com.iot.model.PaperInfo;
import com.iot.model.PaperRecord;
import com.iot.model.User;
import com.iot.repository.PaperInfoRepository;
import com.iot.repository.PaperRecordRepository;
import com.iot.repository.UserRepository;
import com.iot.utils.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import redis.clients.jedis.Jedis;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by xiongxiaoyu
 * Data:2018/7/9
 * Time:15:03
 */

@Controller
public class AdminCtro {

	private Jedis jedis=new Jedis("118.89.36.125", 6379);

	private User user;

	private PaperInfo paperInfo;

	private PaperRecord paperRecord;

	private static String jsessionId;

	StringUtil stringUtil=new StringUtil();

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PaperInfoRepository paperInfoRepository;

	@Autowired
	private PaperRecordRepository paperRecordRepository;


	/**
	 *
	 * @param request
	 * @return
	 * 显示当前管理员出过的试卷
	 */
	@ResponseBody
	@RequestMapping(value = "/api/showPapers")
	public String showPapers (HttpServletRequest request){

		List<PaperInfo> a =new ArrayList<>();
		List<PaperInfo> readed =new ArrayList<>();
		List<PaperInfo> reading =new ArrayList<>();

		List<PaperRecord> records=new ArrayList<>();
		try{
			jsessionId =request.getSession().getId();
			user=userRepository.findByUsername(jedis.get(jsessionId));

			//出现了浅拷贝的情况 会指向Java堆中的同一内存(不可变对象)
			//深拷贝-通过实现cloneable接口实现clone() 对集合内元素一次拷贝
			a=paperInfoRepository.findAllByUsername(user.getUsername());
			reading=paperInfoRepository.findAllByUsername(user.getUsername());

			//遍历集合中的PaperInfo的已经阅卷和等待阅卷情况
			for (int i = 0; i < a.size(); i++) {
				paperInfo = a.get(i);
				records=paperRecordRepository.findByPaperInfoId(paperInfo.getId());

				//如果试卷答卷为0 或者无需要再批阅(paperRecord全是1)则放入readed
				if (records.size()!=0){
					for (int j = 0; j < records.size(); j++) {
						if (records.get(j).getStatus()==1) {
								break;
						}
						else if (j==records.size()-1){
							readed.add(paperInfo);
							//从后面往前面数 来避免乱序的问题
							reading.remove(i+reading.size()-a.size());
						}
					}
				}
				else {
					readed.add(paperInfo);
					//从后面往前面数 来避免乱序的问题
					reading.remove(i+reading.size()-a.size());
				}
			}

		}catch (Exception e){
			System.err.println("/api/showPapers"+e);
			return "{\"success\":false}";
		}
		return "{\"success\":true,\"readed\":"+stringUtil.toReadableTitle(readed)+",\"reading\":"+stringUtil.toReadableTitle(reading)+"}";
	}


	/**
	 *
	 * @param request
	 * @param id
	 * @return
	 *
	 * 显示该试卷参加考试的学生的试卷情况
	 */
	@ResponseBody
	@RequestMapping(value = "/api/showPStu")
	public String showPStu (HttpServletRequest request, @RequestParam(value="id")String id){

		List<PaperRecord> records;

		try{
			jsessionId =request.getSession().getId();
			user=userRepository.findByUsername(jedis.get(jsessionId));
			records=paperRecordRepository.findByPaperInfoId(Long.valueOf(id));

		}catch (Exception e){
			System.err.println("/api/showPStu"+e);
			return "{\"success\":false}";
		}
		return "{\"success\":true,"+stringUtil.toShowPStu(records)+"}";
	}


	/**
	 *
	 * @return
	 * 展示选择的考生的试卷
	 */
	@ResponseBody
	@RequestMapping(value = "/api/showDetail")
	public String showDetail (@RequestParam(value = "email") String email,@RequestParam(value="id")String id){

		try{
			user=userRepository.findByEmail(email);
			paperInfo=paperInfoRepository.findById(Long.valueOf(id));
			paperRecord =paperRecordRepository.findByPaperInfoAndName(Long.valueOf(id),user.getUsername());

		}catch (Exception e){
			System.err.println("/api/showDetail"+e);
			return "{\"success\":false}";
		}
		return "{\"success\":true,"+stringUtil.showPaper(paperInfo,paperRecord)+"}";
	}


	/**
	 *
	 * @param request
	 * @param email
	 * @param id
	 * @param score
	 * @return
	 * 手动阅卷后提交最终成绩
	 */
	@ResponseBody
	@RequestMapping(value = "/api/submitScore")
	public String  submitScore(HttpServletRequest request,@RequestParam(value = "email")String email
			,@RequestParam(value = "id")String id,@RequestParam(value = "score")String score){

		try{
			jsessionId =request.getSession().getId();
			user=userRepository.findByEmail(email);
			paperRecord =paperRecordRepository.findByPaperInfoAndName(Long.valueOf(id),user.getUsername());
			paperRecord.setScore(Integer.valueOf(score));
			paperRecord.setStatus(2);
			paperRecordRepository.saveAndFlush(paperRecord);
		}catch (Exception e){
			System.err.println("/api/aubmitScore"+e);
			return "{\"success\":false}";
		}
		return "{\"success\":true}";
	}

}
