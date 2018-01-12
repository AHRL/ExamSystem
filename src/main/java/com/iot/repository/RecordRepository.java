package com.iot.repository;

import com.iot.model.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by xiongxiaoyu on 2017/12/17.
 */

@Repository
public interface RecordRepository extends JpaRepository<Record,Long>{


	@Query(value = "select * from Record r where r.UserUsername=?1 and r.type=1",nativeQuery = true)
	List<Record> findUserAnswers(String UserUsername);

	@Query(value = "select * from Record r where r.UserUsername=?1 and r.type=0",nativeQuery = true)
	List<Record> findUserQuery(String UserUsername);

//	@Query(value = "update * from Record r r.answerList and r.score and r.rightSerial where r.jsessionId=?4")
//	void  updateByJsessionId()

	Record saveAndFlush(Record record);

	List<Record> findByUserUsername(String UserUsername);

	Record findByJsessionId(String jsessionId);

}
