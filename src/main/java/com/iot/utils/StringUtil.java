package com.iot.utils;

import com.google.gson.Gson;

import java.util.List;

/**
 * Created by xiongxiaoyu on 2018/1/13.
 */
public class StringUtil {

	private Gson gson=new Gson();

	public String[] stringToArray(String s){
		String[] b=s.substring(1,s.length()-1).replace(" ","").split(",");
		return b;
	}

	public int totalNumber(String a,List<String> hh){
		int count=0;
		//这里使用后者是因为.toArray()方法返回的是Object，不能转化成String
//		String [] aa= (String[]) hh.toArray();
		String[] aa= new String[hh.size()];
		for (int k = 0; k < hh.size(); k++) {
			aa[k]=gson.toJson(hh.get(k));
		}
		for (int i = 0; i <aa.length ; i=i+2) {
			aa[i]=aa[i].substring(1,aa[i].length()-1);
			String[] b=aa[i].replace(" ","").split(",");
			for (int j = 0; j <b.length ; j++) {
				if(a.equals(b[j])){
					count++;
				}
			}
		}
		return count;
	}

	public int rightNumber(String a,List<String> hh){
		int count=0;
		Object [] o=hh.toArray();
		String[] gg=new String[hh.size()];
		for (int i = 0; i < hh.size(); i++) {
			gg[i]=gson.toJson(o[i]);
			gg[i]=gg[i].replace("[","").replace("]","").replace(" ","").replace("\"","") ;
			String [] aa=gg[i].split(",");
			for (int j = 0; j <(aa.length/2) ; j++) {
				if(a.equals(aa[j])&&(Integer.parseInt(aa[j+(aa.length/2)])==1)){
					count++;
				}
				}
		}

		return count;
	}

}
