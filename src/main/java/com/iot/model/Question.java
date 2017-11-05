package com.iot.model;

import javax.persistence.Entity;
import javax.persistence.Table;
import java.sql.Date;

/**
 * Created by xiongxiaoyu on 2017/11/5.
 */

@Entity
@Table(name = "question")
public class Question {

    Date date;

    private String chooseType;
    private String chooseLang;
    private String exinfo;
    private String addCodeForExInfo;
    private String singleC_A;
    private String singleC_B;
    private String singleC_C;
    private String singleC_D;
    private String singleC_E;




}
