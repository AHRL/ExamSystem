package com.iot.security;

import com.iot.model.User;
import com.iot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by xiongxiaoyu on 2017/10/16.
 */
public class CustomUserDetailsService implements UserDetailsService{

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user=userRepository.findByUsername(username);
        if(user==null){
            throw new UsernameNotFoundException("not found");
        }

        //这里可以增加一个禁止同时在线的功能


        List<SimpleGrantedAuthority> authorities=new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(user.getRole().name()));

        System.err.println(user.getUsername()+","+
                user.getPassword()+","+authorities);

        return new org.springframework.security.core.userdetails.User(user.getUsername(),
                user.getPassword(), authorities);

    }
}
