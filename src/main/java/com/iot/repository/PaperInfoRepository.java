package com.iot.repository;

import com.iot.model.PaperInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by xiongxiaoyu on 2018/1/22.
 */
@Repository
public interface PaperInfoRepository extends JpaRepository<PaperInfo,Long>{

	List<PaperInfo> findAll();

	PaperInfo findById(Long id);

//	@Query(value = "select p.exam_questions from paper_info p where p.id =?1",nativeQuery = true)
//	List<ExamQuestion> findExamQuesions(Long id);

	@Query(value = "select * from paper_info p where p.user_username=?1",nativeQuery = true)
	List<PaperInfo> findAllByUsername(String UserUsername);



}
