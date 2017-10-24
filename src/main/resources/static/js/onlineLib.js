/**
 * Created by 15928 on 2017/10/23.
 */
window.onload=function(){
    var oresetBtn=document.getElementsByClassName('resetBtn')[0];
    var osubBtn=document.getElementsByClassName('subBtn')[0];
    var oProgramme=document.getElementsByClassName('.practice-choose_programme')[0];
    var arrProgramme=document.getElementsByName('programme');
    var opracticeDefined=document.getElementsByClassName('practice-defined')[0];
    var arrCount=document.getElementsByName('count');
    var arrTip=[];
    var flag=false;
    opracticeDefined.style.display='none';
    //selectProgramme
    function selectProgramme(){
        for(var i=0;i<arrProgramme.length;i++){
            arrProgramme[i].isChecked=false;
            if(arrProgramme[i].checked){
               arrProgramme.isChecked=true;
            }
        }
        for(var i=0;i<arrProgramme.length;i++){
            if(arrProgramme[i].isChecked){
                arrTip.push(arrProgramme[i]);
                flag=true;
            }
        }


    }
    //selectCount
    function selectCount(){
        for(var i=0;i<arrCount.length;i++){
            if(arrCount[i].checked){
                arrTip.unshift('arrCount');
            }
        }
    }
    //selectNone
    function selectNone(){
        for(var i=0;i<arrProgramme.length;i++){
            arrProgramme[i].checked=true;
        }
    }
    //Give tip and submit
    function tip_submit(){

    }

    osubBtn.onclick=selectProgramme;
    oresetBtn.onclick=selectNone;

};