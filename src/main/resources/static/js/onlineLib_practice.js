/**
 * Created by 15928 on 2017/10/28.
 */
window.onload=function(){
    require.config({
        path:{
            'commonfn':'commonfn'
        },
        shim: {
            'commonfn':{
                exports:'commonfn'
            }
        }
    });
    require(['commonfn'],function(commonfn){
        var time=document.getElementsByTagName('time')[0];
        // var timeIcon=document.getElementsByClassName('timeIcon')[0];
        var timeIcon=document.getElementById('timeIcon');
        var collect=document.getElementsByClassName('collect')[0];
        var share=document.getElementsByClassName('share')[0];
        var collectForm=document.forms["collectform"];
        var collectLabelInput=document.getElementById('collectLabel');
        var arrLabelSpan=document.getElementsByClassName('labelSpan');
        // var closeBtn=document.getElementsByClassName('closeBtn')[0];
        // var cancelBtn=document.getElementsByClassName('cancelBtn')[0];
        var closeBtn=document.getElementById('closeBtn');
        var cancelBtn=document.getElementById('cancelBtn');
        // var collectBtn=document.getElementsByClassName('collectBtn')[0];
        // var shareBtn=document.getElementsByClassName('shareBtn')[0];
        var collectBtn=document.getElementById('collectBtn');
        var shareBtn=document.getElementById('shareBtn');
        var aheadBtn=document.getElementsByClassName('aheadBtn')[0];
        var aheadModalBtn=document.getElementsByClassName('aheadModalBtn')[0];
        var sheetToggle=document.getElementsByClassName('sheetToggle')[0];
        var toggleIcon=document.getElementsByClassName('toggleIcon')[0];
        var practiceForm=document.forms["practice-form"];
        var strCollectInputValue='';
        var arrCollectInputValue=[];
        var arrLabelSpanValue=[];
        for(var i=0;i<arrLabelSpan.length;i++){
            arrLabelSpanValue.push(arrLabelSpan[i].innerHTML);
        }
        Array.prototype.removeByValue=function(val){
            for(var i=0;i<this.length;i++){
                if(this[i]===val){
                    this.splice(i,1);
                    return this;
                }
            }
        };
        var oItemType=document.getElementsByClassName('itemType')[0];
        var oItemTitle=document.getElementsByClassName('practice-specific-title')[0];
        var oItemCode=document.getElementsByClassName('practice-specific-code')[0];
        var oItemContent=document.getElementsByClassName('practice-specific-content')[0];
        var oNextBtn=document.getElementsByClassName('nextBtn')[0];
        var oAnswerSheet=document.getElementsByClassName('answer_sheet')[0];
        var strAnswerSheet='';
        var optionUnicode=65;
        var inputVal='';
        var arrSingSelect=[];
        var arrMultipleSelect=[];
        var newData='';
        var items='';
        var arrItems=[];
        var len;
        var jsonArrItems=[];
        var sendAction='';
        var progressNow;

        //加载页面后，请求数据；
        $.ajax({
            url:'offjson.json',
            // url:'http://192.168.43.245/back',
            // url:'http://194oe84904.iok.la/back',
            // url:'http://127.0.0.1/back',
            type:"GET",
            dataType:"text",
            success:function(data){
                // alert(data);
                newData=data.substring(1,data.length-1);
                localStorage.setItem('items',newData);
                items=localStorage.getItem('items');
                arrItems=items.split('},{');
                len=arrItems.length;
                if(len>1){
                    arrItems[0]=arrItems[0]+'}';
                    arrItems[len-1]='{'+arrItems[len-1];
                    for(var i=1;i<len-1;i++){
                        arrItems[i]='{'+arrItems[i]+'}';
                    }
                }
                arrItems.forEach(function(item,index,array){
                    jsonArrItems[index]=JSON.parse(array[index]);
                });

                //将title、code、choices中可能的出现的标签尖括号替换成相应编码
                function replaceStr(strObject) {
                    //注意判断null
                    if(strObject!==null){
                        if(strObject.indexOf('<')!==-1&&strObject.indexOf('>')!==-1) {
                            strObject=strObject.replace(/</g,'&lt;');
                            strObject=strObject.replace(/>/g,'&gt;');
                        }
                    }
                    return strObject;//注意在if语句之外return，否则会出现undefined
                }

                //生成最终的题目格式
                jsonArrItems.map(function(item,index,array){
                    item["info"]=replaceStr(item["info"]);
                    item["code"]=replaceStr(item["code"]);
                    item["choices"]=replaceStr(item["choices"]);
                    return item;
                });

                //题目的答案
                var answers=[];
                for(var i=0;i<len;i++){
                    answers[i]={};
                    answers[i].cid=i;
                    answers[i].id=jsonArrItems[i]["id"];
                    answers[i].answer="";
                }
                // answers[0].answer="A";
                // answers[1].answer="A,D";
                // answers[2].answer="A,D";
                // answers[3].answer="D";

                //生成相应的答题卡
                for(var i=0;i<len;i++){
                    strAnswerSheet+='<li class="sheetLi">'+(i+1)+'</li>';
                }
                var $oAnswerSheet=$(oAnswerSheet);
                $oAnswerSheet.append(strAnswerSheet);

                //填充页面
                function fillPage(item){
                    strItemContent='';
                    oItemContent.innerHTML='';
                    oItemType.innerHTML='['+item["type"]+'题]';
                    oItemTitle.innerHTML=item["info"];
                    if(item["code"]!==''&&item["code"]!==null){
                        oItemCode.innerHTML='<pre><code>'+item["code"]+'</code></pre>';
                    }else{
                        oItemCode.innerHTML='';
                    }
                    if(item["type"]==='单选'){
                        arrSingSelect=item["choices"].split(',');
                        strItemContent='<ul class="list-group practice-single_choice">';
                        for(var i=0;i<arrSingSelect.length;i++){
                            inputVal=String.fromCharCode(i+optionUnicode);
                            strItemContent+='<li class="list-group-item"><label><input type="radio" name="sing_choice" value="'+inputVal+'"/>'+arrSingSelect[i]+'</label></li>';
                        }
                        strItemContent=strItemContent+'</ul>';
                        oItemContent.innerHTML=strItemContent;
                        for(var i=0;i<len;i++){
                            if(answers[i].id===item.id){
                                for(var j=0;j<$('input[name=sing_choice]').length;j++){
                                    if(answers[i].answer===$('input[name=sing_choice]')[j].value){
                                        $('input[name=sing_choice]')[j].checked=true;
                                    }
                                }
                                break;
                            }
                        }
                        //更新答案
                        $('input:radio').each(function(index,domEle){
                            $(domEle).click(function(){
                                for(var i=0;i<len;i++){
                                    if(answers[i].id===item.id){
                                        answers[i].answer=this.value;
                                        break;
                                    }
                                }
                            })
                        });

                    }else if(item["type"]==='多选'){
                        arrMultipleSelect=item["choices"].split(',');
                        strItemContent='<ul class="list-group practice-multiple_choice">';
                        for(var i=0;i<arrMultipleSelect.length;i++){
                            inputVal=String.fromCharCode(i+optionUnicode);
                            strItemContent+='<li class="list-group-item"><label><input type="checkbox" name="multiply_choice" value="'+inputVal+'"/>'+arrMultipleSelect[i]+'</label></li>';
                        }
                        strItemContent=strItemContent+'</ul>';
                        oItemContent.innerHTML=strItemContent;

                        for(var i=0;i<len;i++){
                            if(answers[i].id===item.id){
                                var arrMultiplyAnswer=answers[i].answer.split('');
                                for(var j=0;j<$('input[name=multiply_choice]').length;j++){
                                    for(var k=0;k<arrMultiplyAnswer.length;k++){
                                        if(arrMultiplyAnswer[k]===$('input[name=multiply_choice]')[j].value){
                                            $('input[name=multiply_choice]')[j].checked=true;
                                        }
                                    }
                                }
                                break;
                            }
                        }
                        //更新答案
                        $(':checkbox').each(function(index,domEle){
                            $(domEle).click(function(){
                                for(var i=0;i<len;i++){
                                    if(answers[i].id===item.id){
                                        answers[i].answer='';
                                        for(var j=0;j<$(':checkbox').length;j++){
                                            if($(':checkbox:eq('+j+')').is(':checked')){
                                                answers[i].answer=answers[i].answer+$(':checkbox:eq('+j+')').val();
                                            }
                                        }
                                        // answers[i].answer=answers[i].answer.split('').join(',');
                                        break;
                                    }
                                }
                            })
                        });

                    }else if(item["type"]==='问答'){
                        var strItemContent='<div class="practice-question_and_answers"><textarea  class="form-control" name="textarea" rows="10" autofocus="autofocus"></textarea><div class="areaTip">请在此处写出你的答案 </div>'
                        $('.practice-specific-content').append(strItemContent);
                        var oTextArea=document.getElementsByTagName('textArea')[0];
                        var oAreaTip=document.getElementsByClassName('areaTip')[0];
                        function tipDisNone(){
                            oAreaTip.style.display='none';
                        }
                        function tipDisBlock(){
                            if(oTextArea.value== ''){
                                oAreaTip.style.display='block';
                            }
                        }
                        oTextArea.value= '';
                        oTextArea.onfocus=tipDisNone;
                        oAreaTip.onclick=tipDisNone;
                        oTextArea.onblur=tipDisBlock;
                        for(var i=0;i<len;i++){
                            if(answers[i].id===item.id){
                                oTextArea.value=answers[i].answer;
                                if(oTextArea.value!==''){
                                    tipDisNone();
                                }else{
                                    tipDisBlock();
                                }
                                break;
                            }
                        }

                        //    更新答案
                        $(oTextArea).change(function(){
                            for(var i=0;i<len;i++){
                                if(answers[i].id===item.id){
                                    answers[i].answer=this.value;
                                    break;
                                }
                            }
                        });
                    }

                    //更新进度条
                    for(var i=0;i<len;i++){
                        if(answers[i].id===item.id){
                            progressNow=((answers[i].cid+1)/len)*100;
                            $('.progress-bar').attr('aria-valuenow',progressNow.toFixed(2));
                            $('.progress-bar').css('width',progressNow+'%');
                            $('.progress-bar>span').html(progressNow.toFixed(2)+'% completed');

                            $('.progress-bar_span').html((answers[i].cid+1)+'/'+len);
                            break;
                        }
                    }

                    ////最后一道题时，按钮变为交卷
                    for(var i=0;i<len;i++){
                        if(answers[i].id===item.id){
                            if(answers[i].cid===len-1 ){
                                oNextBtn.innerHTML='交卷';
                                aheadBtn.style.display='none';
                            }else{
                                oNextBtn.innerHTML='下一题';
                                aheadBtn.style.display='block';
                            }
                            break;
                        }
                    }

                    //答题卡的状态 注意：nth-child从1开始，而不是从0开始
                    for(var i=0;i<len;i++){
                        sheetStatus(i,item);
                        $('.practice-answer_sheet ul li:nth-child('+(i+1)+')').hover(function(){
                            $(this).css({
                                background:"#028df7",
                                color:"#fff"
                            })
                        },function(){
                            for(var j=0;j<len;j++){
                                sheetStatus(j,item);
                            }
                        });
                    }
                }

                //页面初次加载时
                var itemOrder=0;
                fillPage(jsonArrItems[itemOrder]);

                //答题卡的状态
                function sheetStatus(i,item) {
                    if(answers[i].id===item.id){
                        $('.practice-answer_sheet ul li:nth-child('+(i+1)+')').css({
                            "background":"#028df7",
                            "color":"#fff"
                        });
                    } else{
                        if(answers[i].answer===""){
                            $('.practice-answer_sheet ul li:nth-child('+(i+1)+')').css({
                                "background":"transparent",
                                "color":"#ccc"
                            });
                        }else if(answers[i].answer!==""){
                            $('.practice-answer_sheet ul li:nth-child('+(i+1)+')').css({
                                "background":"transparent",
                                "color":"#028df7"
                            });
                        }
                    }
                }

                //生成提交URI
                function transURI(){
                    // sendAction="http://192.168.43.245/answersSender?";
                    // sendAction="http://194oe84904.iok.la/answersSender?";
                    sendAction="http://127.0.0.1/answersSender?";
                    for(var i=0;i<len;i++){
                        sendAction=sendAction+answers[i].id+'='+answers[i].answer+'&';
                    }
                    sendAction=sendAction.substring(0,sendAction.length-1);
                    return sendAction;
                }

                //点击下一题时
                // oNextBtn.onclick=
                    function nextBtnClick(){
                    itemOrder++;
                    // var uri=transURI();
                    // console.log(uri);
                    // console.log(answers);

                    //填充页面
                    if(itemOrder<=len-1){
                        fillPage(jsonArrItems[itemOrder]);
                    }
                    if(itemOrder==len){
                        //提交并且提交一次后不可再用
                        oNextBtn.disabled=true;
                        practiceForm.method="POST";
                        practiceForm.action=transURI();
                        practiceForm.submit();
                    }
                }

                //点击提前交卷后弹出的确定按钮，提前交卷
                // aheadModalBtn.onclick=
                    function aheadModalBtnClick(){
                    //把本页添加到URI中
                    aheadModalBtn.disabled=true;
                    practiceForm.method="POST";
                    practiceForm.action=transURI();
                    practiceForm.submit();
                }

                //点击答题卡的li时
                $('.sheetLi').click(function(){
                    itemOrder=this.innerHTML-1;
                    fillPage(jsonArrItems[this.innerHTML-1]);
                });

                //开始正向计时
                //注意一个页面只有唯一的一个定时器，开始和清空都是一个定时器
                var h=0;
                var m=0;
                var s=0;
                var mysetInterval=setInterval(timer, 1000);
                function timer(){
                    s++;
                    if(s>=60) {
                        s=0;
                        m++;
                    }
                    if(m>=60) {
                        m=0;
                        h++;
                    }
                    time.innerHTML=checkTime(h)+':'+checkTime(m)+':'+checkTime(s);
                }
                function checkTime(i){ //将0-9的数字前面加上0，例1变为01
                    return  i<10 ? "0"+i:i;
                }

                // commonfn.EventUtil.addHandler(timeIcon,"click",timeIconClick);
                function timeIconClick(tarEle){//填加tarEle参数，将hasClass的参数this——>tarEle
                    if(commonfn.hasClass(tarEle,'fa-pause-circle')){
                        commonfn.removeClass(tarEle,'fa-pause-circle');
                        commonfn.addClass(tarEle,'fa-play-circle');
                        clearInterval(mysetInterval);
                    }else{
                        commonfn.removeClass(tarEle,'fa-play-circle');
                        commonfn.addClass(tarEle,'fa-pause-circle');
                        mysetInterval=setInterval(timer, 1000);
                    }
                }

                //监控所有的关闭，取消按钮被点击时，输入框文字消失
                commonfn.EventUtil.addHandler(closeBtn,"click",clearForm);
                // commonfn.EventUtil.addHandler(cancelBtn,"click",clearForm);
                function clearForm(){
                    for(var i=0;i<collectForm.elements.length;i++){
                        if(collectForm.elements[i].type==='text'){
                            collectForm.elements[i].value='';
                        }
                    }
                }

                //collectInputKeyUp 监测keyup，使输入标签下方有时，自动变为选中状态
                commonfn.EventUtil.addHandler(collectLabelInput,"keyup",collectInputKeyUp);
                function collectInputKeyUp(){
                    strCollectInputValue=this.value;
                    arrCollectInputValue=strCollectInputValue.trim().split(' ');
                    var arrLabel=[];
                    var labelSpanSelected;
                    for(var i=0;i<arrLabelSpan.length;i++){
                        if(commonfn.hasClass(arrLabelSpan[i],'labelSelected')){
                            commonfn.removeClass(arrLabelSpan[i],'labelSelected');
                        }
                    }
                    arrCollectInputValue.forEach(function(item,index,array){
                        for(var i=0;i<arrLabelSpan.length;i++){
                            if(arrLabelSpan[i].innerHTML===item){
                                // labelSpanSelected=arrLabelSpan[i];
                                arrLabel.push(arrLabelSpan[i]);
                            }else{
                                arrLabel.removeByValue(arrLabelSpan[i]);
                            }
                        }
                        for(var i=0;i<arrLabel.length;i++){
                            commonfn.addClass(arrLabel[i],'labelSelected');
                        }
                    });

                }
                //选择已有标签、鼠标移入、移出
                for(var i=0;i<arrLabelSpan.length;i++){
                    commonfn.EventUtil.addHandler(arrLabelSpan[i],"click",labelSelect);
                    commonfn.EventUtil.addHandler(arrLabelSpan[i],"mouseover",labelMouseOver);
                    commonfn.EventUtil.addHandler(arrLabelSpan[i],"mouseout",labelMouseOut)
                }
                function labelSelect(){
                    if(!commonfn.hasClass(this,'labelSelected')){
                        collectLabelInput.value+=this.innerHTML+' ';
                        commonfn.addClass(this,'labelSelected');
                    }else{
                        var span=this;
                        strCollectInputValue=collectLabelInput.value;
                        arrCollectInputValue=strCollectInputValue.trim().split(' ');
                        collectLabelInput.value='';
                        arrCollectInputValue.forEach(
                            function(item,index,array){
                                if(item!==span.innerHTML){
                                    collectLabelInput.value+=item+' ';
                                }
                            }
                        );
                        commonfn.removeClass(span,'labelSelected');
                    }

                }
                function labelMouseOver(){
                    if(!commonfn.hasClass(this,'labelSelected')){
                        commonfn.addClass(this,'labelHover');
                    }
                }
                function labelMouseOut(){
                    if(commonfn.hasClass(this,'labelHover')){
                        commonfn.removeClass(this,'labelHover');
                    }
                }

// 点击收藏的确定按钮，提交表单
//                 collectBtn.onclick=
                    function collectBtnClick(){
                    $('.collectModal').modal('hide');
                    collectForm.submit();
                }
//点击分享本题的确定按钮，模态框消失
//                 shareBtn.onclick=
                    function shareBtnClick(){
                    $('.shareModal').modal('hide');
                }
//  点击收起答题卡
                sheetToggle.onclick=function(){
                    if(commonfn.hasClass(toggleIcon,"fa-chevron-down")){
                        commonfn.removeClass(toggleIcon,"fa-chevron-down");
                        commonfn.addClass(toggleIcon,"fa-chevron-up");
                    }else{
                        commonfn.removeClass(toggleIcon,"fa-chevron-up");
                        commonfn.addClass(toggleIcon,"fa-chevron-down");
                    }

                };

                //    使用事件委托，，减少事件处理程序，减少内存占用、提高性能
                commonfn.EventUtil.addHandler(document.body,'click',function (event) {
                    event=commonfn.EventUtil.getEvent(event);
                    var target=commonfn.EventUtil.getTarget(event);
                    switch(target.id){
                        case "aheadModalBtn":
                            aheadModalBtnClick();
                            break;
                        case "nextBtn":
                            nextBtnClick();
                            break;
                        case "timeIcon":
                            timeIconClick(target);
                            break;
                        // case "closeBtn": 不起作用？
                        case "cancelBtn":
                            clearForm();
                            break;
                        case "collectBtn":
                            collectBtnClick();
                            break;
                        case "shareBtn":
                            shareBtnClick();
                            break;
                    }
                });
            },
            error:function(){
                alert('error');
            }
        });
    });

};