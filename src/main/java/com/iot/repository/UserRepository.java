package com.iot.repository;

import com.iot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Date;

/**
 * Created by xiongxiaoyu on 2017/10/9.
 */
@Repository
public interface UserRepository extends JpaRepository<User,Integer>{

    User findByUsername(String username);

    User findByEmail(String email);

    long count();

    @Query(value = "select count(u) from User u where u.date=?1 ")
    long registeredDaysBefore(Date date);


}
