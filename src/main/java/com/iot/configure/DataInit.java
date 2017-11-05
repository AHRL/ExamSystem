//package com.iot.configure;
//
//import User;
//import com.iot.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import javax.annotation.PostConstruct;
//
///**
// * Created by xiongxiaoyu on 2017/10/16.
// */
//
//@Service
//public class DataInit {
//
//    @Autowired
//    UserRepository userRepository;
//
//    @PostConstruct
//    public void dataInit(){
//        User admin = new User();
//        admin.setPassword("admin");
//        admin.setEmail("957400829@qq.com");
//        admin.setUsername("admin");
//        admin.setRole(User.ROLE.admin);
//        userRepository.save(admin);
//
//        User user = new User();
//        user.setPassword("user");
//        user.setUsername("user");
//        user.setEmail("90829@qq.com");
//        user.setRole(User.ROLE.user);
//        userRepository.save(user);
//    }
//
//}