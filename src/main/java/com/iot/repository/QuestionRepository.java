package com.iot.repository;

import com.iot.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by xiongxiaoyu on 2017/11/5.
 */

@Repository
public interface QuestionRepository extends JpaRepository<Question,Long> {

    Question findById(Long id);

    @Query(value = "select q.lang from Question q  where  q.lang =?1 or q.lang=?2 or q.lang=?3 or q.lang=?4 limit 0,?5 ",nativeQuery = true)
    List<String> findLang(String A, String B, String C, String D, int count);

    @Query(value = "select * from Question q  where  q.lang =?1 or q.lang=?2 or q.lang=?3 or q.lang=?4 limit 0,?5 ",nativeQuery = true)
    List<Question> find(String A, String B, String C, String D, int count);
//@Query("select q from Question q  where  lang =?1 or lang=?2 or lang=?3 or lang=?4")
//List<Question> find(String A, String B, String C, String D);

    @Query(value = "select q.answer from Question q  where  q.lang =?1 or q.lang=?2 or q.lang=?3 or q.lang=?4 limit 0,?5 ",nativeQuery = true)
    List<String> findAnwserList(String A, String B, String C, String D, int count);


}
