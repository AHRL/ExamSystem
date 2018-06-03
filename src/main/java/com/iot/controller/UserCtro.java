package com.iot.controller;

import com.iot.model.User;
import com.iot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import redis.clients.jedis.Jedis;

/**
 * Created by xiongxiaoyu
 * Data:2018/6/3
 * Time:10:23
 */


@RequestMapping(value = "/api/user")
@Controller()
public class UserCtro {

	private Jedis jedis=new Jedis("118.89.36.125", 6379);

	private User user;

	@Autowired
	private UserRepository userRepository;

	@RequestMapping(method = RequestMethod.PUT)
	public String modify(){return "";}


	@RequestMapping(method = RequestMethod.DELETE)
	public String delete(){return "";}


	public UserCtro() {
	}
}
