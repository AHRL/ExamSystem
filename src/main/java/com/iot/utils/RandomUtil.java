package com.iot.utils;

/**
 * Created by xiongxiaoyu on 2017/11/3.
 */
public class RandomUtil {

    public static String getRandom() {
        String num = "";
        for (int i = 0 ; i < 6 ; i ++) {
            num = num + String.valueOf((int) Math.floor(Math.random() * 9 + 1));
        }
        return num;
    }

}
