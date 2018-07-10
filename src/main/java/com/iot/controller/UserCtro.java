package com.iot.controller;

import com.iot.model.User;
import com.iot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import redis.clients.jedis.Jedis;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by xiongxiaoyu
 * Data:2018/6/3
 * Time:10:23
 */

@Controller()
@RequestMapping(value = "/api")
public class UserCtro {

	private Jedis jedis=new Jedis("118.89.36.125", 6379);

	private User user;

	private static String jsessionId;

	@Autowired
	private UserRepository userRepository;

	/**
	 *
	 * @param grade
	 * @param major
	 * @param other
	 * @param request
	 * @return
	 *
	 * 修改资料
	 */
	@ResponseBody
	@RequestMapping(value ="/modify" ,method = RequestMethod.POST)
	public String modify(@RequestParam(defaultValue = "null",value = "grade") String grade,
						 @RequestParam(defaultValue = "null",value = "major") String major,
						 @RequestParam(defaultValue = "null",value = "other") String other,
						 HttpServletRequest request) {
		try {
			jsessionId =request.getSession().getId();
			user=userRepository.findByUsername(jedis.get(jsessionId));
			user.setGrade(grade);
			user.setMajor(major);
			user.setOther(other);
			userRepository.saveAndFlush(user);

		} catch (Exception e) {
			System.err.println("/api/modify" + e);
			return "{\"ret\":false}";
		}
		return "{\"ret\":true}";
	}


	/**
	 *
	 * @param password
	 * @param request
	 * @return
	 *
	 *  验证密码是否正确
	 */
	@RequestMapping(value = "/modifyPswd",method = RequestMethod.POST)
	public String modifyPswd(
			@RequestParam(defaultValue = "null",value = "password") String password,
			HttpServletRequest request){
		try {
			jsessionId =request.getSession().getId();
			user=userRepository.findByUsername(jedis.get(jsessionId));

			if (password!=user.getPassword()){
				return "{\"ret\":false}";
			}

		} catch (Exception e) {
			System.err.println("/api/modifyPswd" + e);
			return "{\"ret\":false}";
		}
			return "{\"ret\":true}";
	}


	/**
	 *
	 * @param password
	 * @param request
	 * @return
	 *
	 *  保存密码
	 */
	@RequestMapping(value = "/savePswd",method = RequestMethod.POST)
	public String savePswd(
			@RequestParam(defaultValue = "null",value = "password") String password,
			HttpServletRequest request){
		try {
			jsessionId =request.getSession().getId();
			user=userRepository.findByUsername(jedis.get(jsessionId));
			user.setPassword(password);
			userRepository.saveAndFlush(user);
		} catch (Exception e) {
			System.err.println("/api/savePswd" + e);
			return "{\"ret\":false}";
		}
		return "{\"ret\":true}";
	}


}
