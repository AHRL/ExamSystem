package com.iot.repository;

import com.iot.model.ExamQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by xiongxiaoyu on 2018/1/22.
 */

@Repository
public interface ExamQuestionRepository extends JpaRepository<ExamQuestion,Long>{
}
