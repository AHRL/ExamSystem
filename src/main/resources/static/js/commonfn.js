/**
 * Created by 15928 on 2018/3/7.
 */
define(function () {
    //跨浏览器的事件处理程序
    var EventUtil={
            // 添加事件处理程序
            addHandler:function(element,type,handler){
                if(element.addEventListener){
                    element.addEventListener(type,handler,false)
                }else if(element.attachEvent){
                    element.attachEvent('on'+type,handler);
                }else{
                    element['on'+type]=handler;
                }
            },

            //返回对event对象的引用
            getEvent:function(event){
                return event?event:window.event;
            },

            //返回事件的目标
            getTarget:function(event){
                return event.target||event.srcElement;
            },

            //取消事件的默认行为
            preventDefault:function(event){
                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue=false;
                }
            },

            //移除事件处理程序
            removeHandler:function(element,type,handler){
                if(element.removeEventListener){
                    element.removeEventListener(type,handler,false);
                }else if(element.detachEvent){
                    element.detachEvent('on'+type,handler);
                }else{
                    element['on'+type]=null;
                }
            },

            //阻止事件流
            stopPropagation:function(event){
                if(event.stopPropagation){
                    event.stopPropagation();
                }else{
                    event.cancelBubble=true;
                }
            }
        };

    //原生js实现addClass，removeClass，hasClass
    function addClass(elem, cls) {
        if (!hasClass(elem, cls)) {
            elem.className = elem.className == '' ? cls : elem.className + ' ' + cls;
        }
    }
    function hasClass(elem, cls) {
        cls = cls || '';
        if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
        return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
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

    //删除数组中指定的项
    function removeByValue(arr,val){
        for(var i=0;i<arr.length;i++){
            if(arr[i]===val){
                arr.splice(i,1);
                return arr;
            }
        }
    }
    //在目标元素之后添加新元素
    function insertAfter(newElement,targetElement){
        var parent=targetElement.parentNode;
        if(parent.lastChild===targetElement){
            parent.appendChild(newElement);
        }else{
            parent.insertBefore(newElement,targetElement.nextSibling);
        }
    }

    //跨浏览器的getElementsByClassName方法
    var getElementsByClassName= function(node,classname){
        if(node.getElementsByClassName){
            return node.getElementsByClassName(classname);
        }else{
            var results=new Array();
            var reg=new RegExp(' '+classname+' ');
            var elems=node.getElementsByTagName('*');
//                for(var i=0;i<elems.length;i++){
//                    if(reg.test(' '+elems[i]+' ')){
//                        results.push(elems[i]);
//                    }
//                }
            for(var i=0;i<elems.length;i++){
                if(elems[i].className.indexOf(classname)){
                    results[results.length]=elems[i];
                }
            }
            return results;
        }
    };

    //原生js实现清除表单
    function clearForm(id) {
        var objId = document.getElementById(id);
        if (objId === undefined) {
            return;
        }
        for (var i = 0; i < objId.elements.length; i++) {
            if (objId.elements[i].type === "text") {
                objId.elements[i].value = "";
            }
            else if (objId.elements[i].type === "password") {
                objId.elements[i].value = "";
            }
            else if (objId.elements[i].type === "radio") {
                objId.elements[i].checked = false;
            }
            else if (objId.elements[i].type === "checkbox") {
                objId.elements[i].checked = false;
            }
            else if (objId.elements[i].type === "select-one") {
                objId.elements[i].options[0].selected = true;
            }
            else if (objId.elements[i].type === "select-multiple") {
                for (var j = 0; j < objId.elements[i].options.length; j++) {
                    objId.elements[i].options[j].selected = false;
                }
            }
            else if (objId.elements[i].type === "textarea") {
                objId.elements[i].value = "";
            }
            //else if (objId.elements[i].type == "file") {
            // //objId.elements[i].select();
            // //document.selection.clear();
            // // for IE, Opera, Safari, Chrome
            // var file = objId.elements[i];
            // if (file.outerHTML) {
            // file.outerHTML = file.outerHTML;
            // } else {
            // file.value = ""; // FF(包括3.5)
            // }
            //}
        }
    }

    return{
        EventUtil:EventUtil,
        addClass:addClass,
        hasClass:hasClass,
        removeClass:removeClass,
        removeByValue:removeByValue,
        insertAfter:insertAfter,
        getElementsByClassName:getElementsByClassName,
        clearForm:clearForm
    }

});