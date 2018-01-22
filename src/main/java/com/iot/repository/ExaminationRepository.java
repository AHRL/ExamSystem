package com.iot.repository;

import com.iot.model.Examination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by xiongxiaoyu on 2018/1/22.
 */
@Repository
public interface ExaminationRepository extends JpaRepository<Examination,Long>{
}
