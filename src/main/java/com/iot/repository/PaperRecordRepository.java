package com.iot.repository;

import com.iot.model.PaperRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by xiongxiaoyu on 2018/1/22.
 */
@Repository
public interface PaperRecordRepository extends JpaRepository<PaperRecord,Long>{
}
