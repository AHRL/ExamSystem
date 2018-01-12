/**
 * Created by 15928 on 2018/1/6.
 */
var scoreSpan=document.getElementsByClassName('scoreSpan')[0];
var practiceType=document.getElementsByClassName('practiceType')[0];
var practiceScore=document.getElementsByClassName('practiceScore')[0];
var practiceRight=document.getElementsByClassName('practiceRight')[0];
var practiceTime=document.getElementsByClassName('practiceTime')[0];
$.ajax({
    url:'completed.json',
    type:"GET",
    dataType:"json",
    success:function(data){
        console.log(data);
        var type='';
        var totalTime='';
        var jsonTextType=JSON.stringify(data,["A","B","C","D"]);
        var jsonType=JSON.parse(jsonTextType);
        for(var o in jsonType){
           if(jsonType[o]!==''){
               type=type+jsonType[o]+'/';
           }
        }
        function checkTime(t) {
            if(t<10){
                t='0'+t;
            }
            return t;
        }
        function transTime(time){
            var ms=time;
            var s=0,m=0,h=0;
            if(ms>=0){
                s=parseInt(ms/1000);
                ms=ms%1000;
                if(s>=60){
                    m=parseInt(s/60);
                    s=s%60;
                }
                if(m>=60){
                    h=parseInt(m/60);
                    m=parseInt(m%60)
                }
            }
            totalTime=checkTime(h)+":"+checkTime(m)+":"+checkTime(s);
            return totalTime;
        }
        scoreSpan.innerHTML=(100/data.count*data.score).toFixed(2);
        practiceType.innerHTML=type.substring(0,type.length-1);
        practiceRight.innerHTML=data.score+'/'+data.count;
        practiceScore.innerHTML=(100/data.count*data.score).toFixed(2);
        practiceTime.innerHTML=transTime(data.time);

        // progressNow=((answers[i].cid+1)/len)*100;
        // $('.progress-bar').attr('aria-valuenow',progressNow.toFixed(2));
        // $('.progress-bar').css('width',progressNow+'%');
        // $('.progress-bar>span').html(progressNow.toFixed(2)+'% completed');

    },
    error:function(){
        alert('error');
    }
});