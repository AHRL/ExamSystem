import '../scss/onlineLib.scss'

window.onload=function(){
    var oresetBtn=document.getElementsByClassName('resetBtn')[0];
    var osubBtn=document.getElementsByClassName('subBtn')[0];
    var form=document.getElementsByTagName('form')[0];
    var selectAllcheckbox=document.getElementsByClassName('selectAllcheckbox')[0];
    var arrProgramme=document.getElementsByClassName('programme');
    var arrCount=document.getElementsByName('count');
    var opracticeDefined=document.getElementsByClassName('practice-defined')[0];
    var submitTip=document.getElementsByClassName('submitTip')[0];
    var arrTip=[];
    var strTip;
    opracticeDefined.style.height=0+'px';
    opracticeDefined.style.overflow='hidden';
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
    //slide（展开、收起）
    var timer1=null,timer2=null;
    function slideUp(){
        var h=51;
        clearTimeout(timer2);
        timer2=setInterval(function(){
            h-=2;
            if(h<=0){
                h=0;
                clearTimeout(timer2);
            }
            opracticeDefined.style.height=h+'px';
            opracticeDefined.style.overflow='hidden';
        },10);

    }
    function slideDown(){
        var h=0;
        clearInterval(timer1);
        timer1=setInterval(function(){
            h+=2;
            if(h>=51){
                h=51;
                clearInterval(timer1);
            }
            opracticeDefined.style.height=h+'px';
        },10)
    }

    // selectAll（全选或全不选、相应的展开或收起、相应的提示改变）
    EventUtil.addHandler(selectAllcheckbox,"click",selectAll);
   function selectAll() {
        for(var i=0;i<arrProgramme.length;i++){
            arrProgramme[i].checked=selectAllcheckbox.checked;
            if(selectAllcheckbox.checked){
                creatStrtip();
            }else{
                strTip='';
                submitTip.innerHTML='';
            }

        }
        for(var j=0;j<arrProgramme.length;j++){
            var definedHeight = opracticeDefined.clientHeight;
            if(arrProgramme[j].checked){
                if(definedHeight===0){
                    slideDown();
                }
                return;
            }else{
                slideUp();
            }
        }
    }

    //autoSelectAll（自动全选、全不选）
    for(var i=0;i<arrProgramme.length;i++){
        // arrProgramme[i].addEventListener('click',autoSelectAll,false);
        EventUtil.addHandler(arrProgramme[i],"click",autoSelectAll)
    }
    function autoSelectAll(){
        for(var i=0;i<arrProgramme.length;i++){
            if(!arrProgramme[i].checked){
                selectAllcheckbox.checked=false;
                return;
            }
        }
        selectAllcheckbox.checked=true;
    }

    //点击选项时，张开、收起
    for(var j=0;j<arrProgramme.length;j++){
        arrProgramme[j].addEventListener('click',function() {
                for (var i = 0; i < arrProgramme.length; i++) {
                    if (arrProgramme[i].checked) {
                        var definedHeight = opracticeDefined.clientHeight;
                        if (definedHeight > 0) {
                        } else {
                            slideDown();
                        }
                        return;
                    }
                }
                slideUp();
            },false
        )
    }

    //btnSubmit（提交时判断是否选择了相应的编程语言）
    var dataString='';
    // var $arrProgramme=$(arrProgramme);
    var $form=$(form);
    EventUtil.addHandler(osubBtn,"click",function(event){
            event.preventDefault();
            var flag=false;
            for(var i=0;i<arrProgramme.length;i++){
                if(arrProgramme[i].checked){
                    flag=true;
                    break;
                }
            }
            if(flag===false){
                submitTip.innerHTML='请选择您要练习的题目';
                submitTip.classList.add('selectNone');
            }else{
                for(var i=0;i<arrProgramme.length;i++){
                    if(arrProgramme[i].checked){
                        submitTip.innerHTML=strTip;
                        if(submitTip.className==='submitTip selectNone'){
                            submitTip.classList.remove('selectNone');
                        }
                    }
                }
                this.disabled=true;
                form.submit();
            }

    });
    //selectNone（重选）
    function selectNone(){
        var definedHeight=opracticeDefined.clientHeight;
        if(definedHeight>0){
            slideUp();
        }
        strTip='';
        submitTip.innerHTML='';
    }
    EventUtil.addHandler(oresetBtn,"click",selectNone);


    //选择题目类型和练习题目数，给出相应的提示
    for(var i=0;i<arrProgramme.length;i++){
        EventUtil.addHandler(arrProgramme[i],"click" ,creatStrtip);
    }
    for(var i=0;i<arrCount.length;i++){
        EventUtil.addHandler(arrCount[i],"click",creatStrtip);
    }
    //creatStrtip （生成提示字符串）
    function creatStrtip(){
        arrTip=[];
        strTip='';
        selectProgramme();
        selectCount();
        if(arrTip.length===1){
            arrTip=[];
        }
        strTip=arrTip.join(' | ');
        submitTip.innerHTML=strTip;
        if(submitTip.className==='submitTip selectNone'){
            submitTip.classList.remove('selectNone');
        }
    }
    //selectProgramme （把选择的题目类型添加到提示数组）
    function selectProgramme(){
        for(var i=0;i<arrProgramme.length;i++){
            if(arrProgramme[i].checked){
                arrTip.unshift(arrProgramme[i].value);
            }
        }
    }
    //selectCount （把选择练习的题目数添加到提示数组）
    function selectCount(){
        for(var i=0;i<arrCount.length;i++){
            if(arrCount[i].checked){
                arrTip.push(arrCount[i].value);
            }
        }
    }
};