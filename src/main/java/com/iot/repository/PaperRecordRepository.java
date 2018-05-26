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

//	@Query(value = "select r.lang_list,r.right_serial from Record r where r.User_Username=?1 and r.type=1",nativeQuery = true)
	@Query(value = "select * from paper_record  p where p.user_username=?1",nativeQuery = true)
	List<PaperRecord>  findExamedPaperByUsername(String username);
//	List<PaperRecord>  findExamedPaperByUsername();

	//这里出现了bug，很难受examing，status不要或是 =0/<0 仍然会Error0,SQLState:S0022  score=-1?
	@Query(value = "select p.date,p.name, p.deadline,p.location from paper_record  p  where  p.user_username=?1 AND p.status = 0  " ,nativeQuery = true)
	List<PaperRecord>  findExamingPaperByUsername(String username);

	@Query(value = "select * from paper_record p where p.token=?1 and p.user_username=?2",nativeQuery = true)
	PaperRecord findByTokenAndName(String token,String username);

	PaperRecord saveAndFlush(PaperRecord paperRecord);

}
