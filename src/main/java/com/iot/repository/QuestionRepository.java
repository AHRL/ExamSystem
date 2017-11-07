package com.iot.repository;

import com.iot.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by xiongxiaoyu on 2017/11/5.
 */

public interface QuestionRepository extends JpaRepository<Question,Long> {

    Question findById(Long id);

}
