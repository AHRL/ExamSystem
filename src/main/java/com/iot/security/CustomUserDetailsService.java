package com.iot.security;

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

        com.iot.model.login.User user=userRepository.findByUsername(username);
        if(user==null){
            throw new UsernameNotFoundException("not found");
        }
        List<SimpleGrantedAuthority> authorities=new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(user.getRole().name()));
        System.err.print("username is "+username +","+user.getRole().name());

        return new org.springframework.security.core.userdetails.User(user.getUsername(),
                user.getPassword(), authorities);

    }
}
