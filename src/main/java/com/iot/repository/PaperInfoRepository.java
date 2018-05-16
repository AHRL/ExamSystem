package com.iot.repository;

import com.iot.model.PaperInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by xiongxiaoyu on 2018/1/22.
 */
@Repository
public interface PaperInfoRepository extends JpaRepository<PaperInfo,Long>{
	List<PaperInfo> findAll();

	PaperInfo findById(Long id);
}
