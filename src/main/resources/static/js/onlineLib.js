/**
 * Created by 15928 on 2017/10/23.
 */
window.onload=function(){
    var oresetBtn=document.getElementsByClassName('resetBtn')[0];
    var osubBtn=document.getElementsByClassName('subBtn')[0];
    var form=document.getElementsByTagName('form')[0];
    var selectAllcheckbox=document.getElementsByClassName('selectAllcheckbox')[0];
    var arrProgramme=document.getElementsByName('programme');
    var arrCount=document.getElementsByName('count');
    var opracticeDefined=document.getElementsByClassName('practice-defined')[0];
    var submitTip=document.getElementsByClassName('submitTip')[0];
    var arrTip=[];
    var strTip;
    opracticeDefined.style.height=0+'px';
    opracticeDefined.style.overflow='hidden';
//检测浏览器是否支持hashchange事件
    var isSupported=("onhashchange" in window)&&(document.documentMode===undefined ||documentMode>7);
    if(isSupported){

    }

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
    selectAllcheckbox.onclick=function selectAll() {
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
    };

    //autoSelectAll（自动全选、全不选）
    for(var i=0;i<arrProgramme.length;i++){
        arrProgramme[i].addEventListener('click',autoSelectAll,false);
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
    osubBtn.onclick=function(event){
      for(var i=0;i<arrProgramme.length;i++){
          if(arrProgramme[i].checked){
              submitTip.innerHTML=strTip;
              if(submitTip.className==='submitTip selectNone'){
                  submitTip.classList.remove('selectNone');
              }
              form.submit();
              this.disabled=true;
              return;
          }
          event.preventDefault();
          submitTip.innerHTML='请选择您要练习的题目';
          submitTip.classList.add('selectNone');
      }
    };

    //selectNone（重选）
    oresetBtn.onclick=function selectNone(){
        var definedHeight=opracticeDefined.clientHeight;
        if(definedHeight>0){
            slideUp();
        }
        strTip='';
        submitTip.innerHTML='';
    };

    //选择题目类型和练习题目数，给出相应的提示
    for(var i=0;i<arrProgramme.length;i++){
        arrProgramme[i].addEventListener('click',creatStrtip,false);
    }
    for(var i=0;i<arrCount.length;i++){
        arrCount[i].addEventListener('click',creatStrtip,false);
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