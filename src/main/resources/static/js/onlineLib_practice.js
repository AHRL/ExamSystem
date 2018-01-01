/**
 * Created by 15928 on 2017/10/28.
 */
window.onload=function(){
    var time=document.getElementsByTagName('time')[0];
    var timeIcon=document.getElementsByClassName('timeIcon')[0];
    var collect=document.getElementsByClassName('collect')[0];
    var share=document.getElementsByClassName('share')[0];
    var collectForm=document.forms["collectform"];
    var collectLabelInput=document.getElementById('collectLabel');
    var arrLabelSpan=document.getElementsByClassName('labelSpan');
    var closeBtn=document.getElementsByClassName('closeBtn')[0];
    var cancelBtn=document.getElementsByClassName('cancelBtn')[0];
    var collectBtn=document.getElementsByClassName('collectBtn')[0];
    var shareBtn=document.getElementsByClassName('shareBtn')[0];
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
    //跨浏览器的事件处理程序
    var EventUtil={
        addHandler:function(element,type,handler) {
            if (element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent("on" + type, handler);
            } else {
                element["on" + type] = handler;
            }
        },
        removeHandler:function(element,type,handler){
            if(element.removeEventListener){
                element.removeEventListener(type,handler,false);
            }else if(element.detachEvent){
                element.detach("on"+type,handler);
            }else{
                element['on'+type]=null;
            }

        }
    };
    //通用函数
    function hasClass(elem, cls) {
        cls = cls || '';
        if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
        return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
    }

    function addClass(elem, cls) {
        if (!hasClass(elem, cls)) {
            elem.className = elem.className == '' ? cls : elem.className + ' ' + cls;
        }
    }

    function removeClass(elem, cls) {
        if (hasClass(elem, cls)) {
            var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
            while (newClass.indexOf(' ' + cls + ' ') >= 0) {
                newClass = newClass.replace(' ' + cls + ' ', ' ');
            }
            elem.className = newClass.replace(/^\s+|\s+$/g, '');
        }
    }

    Array.prototype.removeByValue=function(val){
        for(var i=0;i<this.length;i++){
            if(this[i]===val){
                this.splice(i,1);
                return this;
            }
        }
    };

    //加载页面后，请求数据；
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
    $.ajax({
        url:'offjson.json',
        // url:'http://192.168.43.245/back',
        type:"GET",
        dataType:"text",
        success:function(data){
            newData=data.substring(1,data.length-1);
            localStorage.setItem('items',newData);

            items=localStorage.getItem('items');
            arrItems=items.split('},{');
            len=arrItems.length;
            arrItems[0]=arrItems[0]+'}';
            arrItems[len-1]='{'+arrItems[len-1];
           for(var i=1;i<len-1;i++){
               arrItems[i]='{'+arrItems[i]+'}';
           }
           arrItems.forEach(function(item,index,array){
               jsonArrItems[index]=JSON.parse(array[index]);
           });
            //将title、code、choices中可能的出现的标签尖括号替换成相应编码
            function replaceStr(strObject) {
                if(strObject.indexOf('<')!==-1&&strObject.indexOf('>')!==-1) {
                    strObject=strObject.replace(/</g,'&lt;');
                    strObject=strObject.replace(/>/g,'&gt;');
                }
                return strObject;//注意在if语句之外return，否则会出现undefined
            }
            //生成最终的题目格式
            jsonArrItems.map(function(item,index,array){
                item["info"]=replaceStr(item["info"]);
                item["code"]=replaceStr(item["code"]);
                item["choices"]=replaceStr(item["choices"]);
                // console.log(item);
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
                if(item["code"]!==''){
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
                            var arrMultiplyAnswer=answers[i].answer.split(',');
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
                                    answers[i].answer=answers[i].answer.split('').join(',');
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

                //最后一道题时，按钮变为交卷
                for(var i=0;i<len;i++){
                    if(answers[i].id===item.id){
                        if(answers[i].cid===len-1){
                            oNextBtn.innerHTML='交卷';
                            aheadBtn.style.display='none';
                        }else{
                            oNextBtn.innerHTML='下一题';
                            aheadBtn.style.display='block';
                        }
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
                sendAction="http://192.168.43.245/answersSender?";
                for(var i=0;i<len;i++){
                    sendAction=sendAction+answers[i].id+'="'+answers[i].answer+'"&';
                }
                sendAction=sendAction.substring(0,sendAction.length-1);
                return sendAction;
            }

            //点击下一题时
            oNextBtn.onclick=function(){
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
                    this.disabled=true;
                    practiceForm.method="POST";
                    practiceForm.action=transURI();
                    practiceForm.submit();
                }
            };

            //点击提前交卷后弹出的确定按钮，提前交卷
            aheadModalBtn.onclick=function(){
                //把本页添加到URI中
                practiceForm.method="POST";
                practiceForm.action=transURI();
                practiceForm.submit();
            };

            //点击答题卡的li时
            $('.sheetLi').click(function(){
                fillPage(jsonArrItems[this.innerHTML-1]);
            });

            //开始正向计时
            var then=new Date();
            var h=0;
            var m=0;
            var s=0;
            var ms=0;
            var mysetInterval=setInterval(timer, 1000);
            function timer(){
                // var now=new Date();
                // ms=now-then;
                s++;
                // h=checkTime(parseInt(ms/3600000)%60);
                // m=checkTime(parseInt(ms/60000)%60);
                // s=checkTime(parseInt(ms/1000)%60);
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

            EventUtil.addHandler(timeIcon,"click",timeIconClick);
            function timeIconClick(){
                if(hasClass(this,'fa-pause-circle')){
                    removeClass(this,'fa-pause-circle');
                    addClass(this,'fa-play-circle');
                    clearInterval(mysetInterval);
                }else{
                    removeClass(this,'fa-play-circle');
                    addClass(this,'fa-pause-circle');
                    setInterval(timer, 1000);
                }
            }

            //监控所有的关闭，取消按钮被点击时，输入框文字消失
            EventUtil.addHandler(closeBtn,"click",clearForm);
            EventUtil.addHandler(cancelBtn,"click",clearForm);
            function clearForm(){
                for(var i=0;i<collectForm.elements.length;i++){
                    if(collectForm.elements[i].type==='text'){
                        collectForm.elements[i].value='';
                    }
                }
            }

            //collectInputKeyUp 监测keyup，使输入标签下方有时，自动变为选中状态
            EventUtil.addHandler(collectLabelInput,"keyup",collectInputKeyUp);
            function collectInputKeyUp(){
                strCollectInputValue=this.value;
                arrCollectInputValue=strCollectInputValue.trim().split(' ');
                var arrLabel=[];
                var labelSpanSelected;
                for(var i=0;i<arrLabelSpan.length;i++){
                    if(hasClass(arrLabelSpan[i],'labelSelected')){
                        removeClass(arrLabelSpan[i],'labelSelected');
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
                        addClass(arrLabel[i],'labelSelected');
                    }
                });

            }
            //选择已有标签、鼠标移入、移出
            for(var i=0;i<arrLabelSpan.length;i++){
                EventUtil.addHandler(arrLabelSpan[i],"click",labelSelect);
                EventUtil.addHandler(arrLabelSpan[i],"mouseover",labelMouseOver);
                EventUtil.addHandler(arrLabelSpan[i],"mouseout",labelMouseOut)
            }
            function labelSelect(){
                if(!hasClass(this,'labelSelected')){
                    collectLabelInput.value+=this.innerHTML+' ';
                    addClass(this,'labelSelected');
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
                    removeClass(span,'labelSelected');
                }

            }
            function labelMouseOver(){
                if(!hasClass(this,'labelSelected')){
                    addClass(this,'labelHover');
                }
            }
            function labelMouseOut(){
                if(hasClass(this,'labelHover')){
                    removeClass(this,'labelHover');
                }
            }

// 点击收藏的确定按钮，提交表单
            collectBtn.onclick=function(){
                $('.collectModal').modal('hide');
                collectForm.submit();
            };
//点击分享本题的确定按钮，模态框消失
            shareBtn.onclick=function(){
                $('.shareModal').modal('hide');
            };
//  点击收起答题卡
            sheetToggle.onclick=function(){
                if(hasClass(toggleIcon,"fa-chevron-down")){
                    removeClass(toggleIcon,"fa-chevron-down");
                    addClass(toggleIcon,"fa-chevron-up");
                }else{
                    removeClass(toggleIcon,"fa-chevron-up");
                    addClass(toggleIcon,"fa-chevron-down");
                }

            }

        },
        error:function(){
            alert('error');
        }
     });
};