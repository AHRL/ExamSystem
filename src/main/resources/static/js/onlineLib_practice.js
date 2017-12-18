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
    var $practiceForm=$(practiceForm);
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
    var strItemContent='';
    var arrSingSelect=[];
    var arrMultipleSelect=[];
    var newData='';
    var answers='';
    var items='';
    var arrItems=[];
    var len;
    var jsonArrItems=[];
    var sendAction="http://192.168.43.245/answersSender?";
    $.ajax({
        url:'offjson.json',
        // url:'http://192.168.43.245/back',
        type:"GET",
        dataType:"text",
        success:function(data){
            newData=data.substring(1,data.length-1);
            localStorage.setItem('items',newData);

            // localStorage.setItem('answers',answers+123);
            //
            // console.log(typeof  localStorage.getItem('items'));
            //
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
                return item;
            });

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

                   }else if(item["type"]==='多选'){
                       arrMultipleSelect=item["choices"].split(',');
                       strItemContent='<ul class="list-group practice-multiple_choice">';
                       for(var i=0;i<arrMultipleSelect.length;i++){
                           inputVal=String.fromCharCode(i+optionUnicode);
                           strItemContent+='<li class="list-group-item"><label><input type="checkbox" name="multiply_choice" value="'+inputVal+'"/>'+arrMultipleSelect[i]+'</label></li>';
                       }
                       strItemContent=strItemContent+'</ul>';
                       oItemContent.innerHTML=strItemContent;

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
                   }
            }

            //页面初次加载时
            var itemOrder=0;
            fillPage(jsonArrItems[itemOrder]);
            $('.practice-answer_sheet ul li:first-child').addClass('displayed');
            $('.practice-answer_sheet ul li:gt(0)').addClass('undisplayed');

            //生成提交URI
            function transURI(itemOrder){
                if($practiceForm.serializeArray()[0]!=undefined){
                    //传递的URI
                    if($practiceForm.serializeArray()[0]["name"]=="sing_choice"||$practiceForm.serializeArray()[0]["name"]=="textarea"){
                        sendAction+=jsonArrItems[itemOrder-1]["id"]+'="'+$practiceForm.serializeArray()[0]["value"]+'"&';
                    }else if($practiceForm.serializeArray()[0]["name"]=="multiply_choice"){
                        var selectedCount=$practiceForm.serializeArray().length;
                        var selectedResult='';
                        for(var i=0;i<selectedCount;i++){
                            selectedResult+=$practiceForm.serializeArray()[i]["value"]+',';
                        }
                        selectedResult=selectedResult.slice(0,selectedResult.length-1);
                        sendAction+=jsonArrItems[itemOrder-1]["id"]+'="'+selectedResult+'"';
                        sendAction+='&';
                    }
                    //判断是否答题，决定答题卡的状态
                    //textArea是个例外，value为空时，$practiceForm.serializeArray()[0]!=undefined
                    if($practiceForm.serializeArray()[0]["value"]!=''){
                        $(".practice-answer_sheet ul li:eq("+(itemOrder-1)+")").addClass('completed');
                    }else{
                        $(".practice-answer_sheet ul li:eq("+(itemOrder-1)+")").addClass('undisplayed');
                    }
                }else{
                    sendAction+=jsonArrItems[itemOrder-1]["id"]+'="'+'"'+'&';
                    $(".practice-answer_sheet ul li:eq("+(itemOrder-1)+")").addClass('undisplayed');
                }
            }

            //点击下一题时
            oNextBtn.onclick=function(){
                itemOrder++;
                $(".practice-answer_sheet ul li:eq("+(itemOrder-1)+")").removeClass('displayed');
                // console.log(jsonArrItems[itemOrder-1]["id"]);
                // console.log($practiceForm.serializeArray());
                // console.log($practiceForm.serializeArray()[0]);
                // console.log($practiceForm.serializeArray()[0]["name"]);
                // console.log($practiceForm.serializeArray()[0]);
                //把上一页添加到URI中
                transURI(itemOrder);
                console.log(sendAction);
                //答题卡的状态，点击"下一题"按钮时，改变上一题按钮的状态
                $(".practice-answer_sheet ul li:eq("+itemOrder+")").removeClass('undisplayed').addClass('displayed');
                //填充页面
                if(itemOrder<len-1){
                    fillPage(jsonArrItems[itemOrder]);
                }else if(itemOrder==len-1){
                    fillPage(jsonArrItems[itemOrder]);
                    this.innerHTML="交卷";
                    aheadBtn.style.display='none';
                }else if(itemOrder==len){
                    //提交并且提交一次后不可再用
                    this.disabled=true;
                    sendAction=sendAction.slice(0,sendAction.length-1);
                    //http://192.168.43.245/answersSender?8=""&9=""&10=""&11=""
                    // console.log(sendAction);
                    practiceForm.method="POST";
                    practiceForm.action=sendAction;
                    practiceForm.submit();
                }
            };

            //点击提前交卷后弹出的确定按钮，提前交卷
            aheadModalBtn.onclick=function(){
                //把本页添加到URI中
                transURI(itemOrder+1);

                sendAction=sendAction.slice(0,sendAction.length-1);
                console.log(sendAction);
                practiceForm.method="POST";
                practiceForm.action=sendAction;
                practiceForm.submit();
            };

            //点击答题卡的li时
            $('.sheetLi').click(function(){
                fillPage(jsonArrItems[this.innerHTML-1]);
                for(var i=0;i<len;i++){
                    if($(".practice-answer_sheet ul li:eq("+i+")").hasClass('displayed')){
                        $(".practice-answer_sheet ul li:eq("+i+")").removeClass('displayed');
                    }

                }
                $(".practice-answer_sheet ul li:eq("+(this.innerHTML-1)+")").addClass('displayed');
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
// 点击提前交卷的确定按钮后，提交表单
//             aheadBtn.onclick=function(){
//                 $('.aheadModal').modal('hide');
//                 // practiceForm.submit();
//             };
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