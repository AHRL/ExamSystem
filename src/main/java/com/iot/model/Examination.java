package com.iot.model;

import javax.persistence.*;
import java.sql.Date;

/**
 * Created by xiongxiaoyu on 2018/1/14.
 */

@Entity
@Table(name = "examination")
public class Examination {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private Date date;

	private String examType;

	@Column(length=1024 )
	private String examDesc;

	@Column(length=1024 )
	private String examCode;

	@Column(length = 2048 )
	private String examChoice;



}
