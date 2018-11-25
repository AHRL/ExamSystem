package com.iot.bean;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import redis.clients.jedis.Jedis;

/**
 * Created by xiongxiaoyu
 * Data:2018/11/20
 * Time:21:11
 */

@Configuration
public class RedisBean {

	@Bean
	public Jedis redisDao(@Value("${spring.redis.host}")String ip,@Value("${spring.redis.host}")int host){
		return new Jedis(ip,host);
	}
}
