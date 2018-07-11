package com.iot.repository;

import com.iot.model.PaperRecord;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by xiongxiaoyu
 * Data:2018/5/17
 * Time:12:14
 */

@Repository
public interface PaperRecordRepository extends CrudRepository<PaperRecord,Long> {

	@Query(value = "select * from paper_record  p where p.user_username=?1",nativeQuery = true)
	List<PaperRecord> findByUserUsername(String username);

	@Query(value = "select * from paper_record  p  where p.paper_info_id=?1",nativeQuery = true)
	List<PaperRecord> findByPaperInfoId(Long id);

	@Query(value = "select * from paper_record  p where p.user_username=?1 AND p.status = 1",nativeQuery = true)
	List<PaperRecord>  findExamedPaperByUsername(String username);

	//JPA返回的是Object，当返回指定查讯类型的时候应该是返回真实类型？？
	//这里出现了bug，很难受examing，status不要或是 =0/<0 仍然会Error0,SQLState:S0022  score=-1?
	@Query(value = "select * from paper_record  p  where  p.user_username=?1 AND p.status = 0  " ,nativeQuery = true)
	List<PaperRecord>  findExamingPaperByUsername(String username);

	@Query(value = "select * from paper_record p where p.paper_info_id=?1 and p.user_username=?2",nativeQuery = true)
	PaperRecord findByPaperInfoAndName(Long id,String username);

	PaperRecord saveAndFlush(PaperRecord paperRecord);


}
