package com.iot.repository;

import com.iot.model.ExamQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by xiongxiaoyu on 2018/1/22.
 */

@Repository
public interface ExamQuestionRepository extends JpaRepository<ExamQuestion,Long>{


	//通过试题对应的paperId获取答案失败，找不到对应引用
	@Query(value = "select e.solution from ExamQuestion e where e.id = ?1",nativeQuery = true)
	List<String> findAnwsers(Long id);

}
