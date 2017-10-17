package com.iot.repository;

import com.iot.model.login.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by xiongxiaoyu on 2017/10/9.
 */
@Repository
public interface UserRepository extends JpaRepository<User,Integer>{

    User findByUsername(String username);
}
