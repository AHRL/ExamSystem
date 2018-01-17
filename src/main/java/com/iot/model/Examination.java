package com.iot.model;

import javax.persistence.*;

/**
 * Created by xiongxiaoyu on 2018/1/14.
 */

@Entity
@Table(name = "examination")
public class Examination {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private String examType;
	private String examDesc;
	private String examCode;

	private String examChoiceA;
	private String examChoiceB;
	private String examChoiceC;
	private String examChoiceD;


}
