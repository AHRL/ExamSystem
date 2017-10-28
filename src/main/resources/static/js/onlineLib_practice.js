/**
 * Created by 15928 on 2017/10/28.
 */
window.onload=function(){
    var collect=document.getElementsByClassName('collect')[0];
    var share=document.getElementsByClassName('share')[0];
    var sheetToggle=document.getElementsByClassName('shareToggle')[0];
    var collectForm=document.forms["collectform"];
    var collectLabelInput=document.getElementById('collectLabel');
    var arrLabelSpan=document.getElementsByClassName('labelSpan');
    var closeBtn=document.getElementsByClassName('closeBtn')[0];
    var cancelBtn=document.getElementsByClassName('cancelBtn')[0];
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
};