// create Object EventUtil
var EventUtil = {
    addHandler: function(element, type, handler){
        if (element.addEventListener){
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent){
            element.attachEvent('on' + type, handler);
        } else {
            element['on'+type] = handler;
        }
    },
    removeHandler: function(element, type, handler){
        if (element.removeEventListener){
            element.removeEventListener(type, handler, false);
        } else if(element.detachEvent){
            element.detachEvent('on' + type, handler);
        } else {
            element['on'+type] = null;
        }
    },
    getEvent: function(event){
        return event ? event : window.event;
    },
    getTarget: function(event){
        return event.target || event.srcElement;
    },
    preventDefault: function(event){
        if(event.preventDefault){
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    stopPropagation: function(event){
        if(event.stopPropagation){
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }
};

// create Function getClass(), addClass(), removeClass(), hasClass()
// Function removeClass() based Professional JavaScript for Web Developers 3rd Edition
function getClass(obj) {
    return obj.className.split(/\s+/);
}
function addClass(obj, newCls) {
    var aCls = getClass(obj);
    if (Array.isArray(aCls)){
        aCls.push(newCls);
        obj.className = aCls.join(' ');
    }
}
function removeClass(obj, targetCls) {
    var aCls = getClass(obj);
    if (Array.isArray(aCls)){
        if (aCls.length){
            var len = aCls.length;
            var pos = -1;
            for (var i=0; i<len; i++){
                if (aCls[i] === targetCls){
                    pos = i;
                    break;
                }
            }
            aCls.splice(i, 1);
            obj.className = aCls.join(' ');
        }
    }
}
function hasClass(obj, targetCls) {
    var aCls = getClass(obj);
    if (Array.isArray(aCls)){
        var len = aCls.length;
        for (var i=0; i<len; i++){
            if (aCls[i] === targetCls){
                return true;
            }
        }
        // return false;
    }
    return false;
}

function showTip(tip){
    this.lastElementChild.innerHTML = tip;
    this.style.display = 'block';
}

// create Function checkPswdStrength()
function checkPswdStrength(sValue){
    var mode;
    if (sValue){
        var len = sValue.length;
        var matchUpperCase = sValue.split('').every(function (item) {
                return (/[A-Z]/).test(item);
            }),
            matchLowerCase = sValue.split('').every(function(item){
                return (/[a-z]/).test(item);
            }),
            matchNum = sValue.split('').every(function (item) {
                return (/[0-9]/).test(item);
            }),
            matchLength = sValue.length;
        var singleMod = (matchUpperCase&&!matchLowerCase&&!matchNum) || (!matchUpperCase&&matchLowerCase&&!matchNum) || (!matchUpperCase&&!matchLowerCase&&matchNum);
        if ( matchLength<8 || matchLength>16 ){
            mode = 0;  // not match
        } else {
            if (len<=10){
                if (singleMod){
                    mode = 1;  // low
                } else {
                    mode = 2;  // middle
                }

            } else {
                if (singleMod){
                    mode = 2;  // middle
                } else {
                    mode = 3;  // high
                }
            }
        }
        switch (mode){
            case 0:
                return 0;
                break;
            case 1:
                return 1;
                break;
            case 2:
                return 2;
                break;
            case 3:
                return 3;
                break;
        }
    }
}

// create Function createPswdStrength()
// use Function insertAfter()
function createPswdStrength(preSiblingNode, mode) {
    if (mode) {
        var division = document.createElement('div');
        division.className = 'pswdStrength';
        var info = (function(){
            var span = document.createElement('span');
            span.className = 'pswdStrength-info';
            var aStrength = ['弱', '中', '强'];
            var strength = aStrength[mode-1];
            span.innerHTML = '&check; 密码强度：' + strength;
            return span;
        })();
        division.appendChild(info);
        for(var i=0; i<3; i++){
            (function (i, mode){
                var spanItems = [];
                spanItems[i] = document.createElement('span');
                addClass(spanItems[i], 'pswdStrength-item');
                if (i<mode){
                    addClass(spanItems[i], 'pswdStrength-item--active')
                }
                division.appendChild(spanItems[i]);
            })(i, mode);
        }
        insertAfter(division, preSiblingNode);
    }
}

// create Function createValidateMsg()
/*function createValidateMsg(obj, str, boo){
    var para = document.createElement('p');
    para.className = 'validationMsg';
    var b = boo || false;
    if(b){
        addClass(para, 'validationMsg-successed');
        para.innerHTML = '&check; ' + str;
    } else {
        addClass(para, 'validationMsg-failed');
        para.innerHTML = '&bigotimes; ' + str;
    }
    insertAfter(para, obj);
}*/
// create Function popTip() and pupTip()
function popTip(msg, classNames){
    var span = document.createElement('span');
    span.innerHTML = msg;
    this.nextElementSibling.appendChild(span);
    classNames = ' ' + classNames.split(' ') + ' ';
    addClass(this.nextElementSibling, classNames);
}
function pupTip(){
    removeClass('fade-in');
    addClass('fade-out');
}

// create Function insertAfter() and removeAfter()
// Based DOM Scripting - Web Design with JavaScript and the Document Object Model
function insertAfter(newElement, targetElement){
    var parent = targetElement.parentNode;
    if (parent.lastChild === targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}
function removeAfter(targetElement){
    var parent = targetElement.parentNode;
    parent.removeChild(targetElement.nextSibling);
}

// create Function clearForm()
// Based http://www.cnblogs.com/shanlin/archive/2014/07/17/3850417.html
function clearForm() {
    var aIpt = this.getElementsByTagName('input');
    var len = aIpt.length;
    if (len){
        for (var j=0; j<len; j++){
            (function (j) {
                removeAfter(aIpt[j]);
                if (hasClass(aIpt[j], 'validationStyle-successed')){
                    removeClass(aIpt[j], 'validationStyle-successed');
                } else {
                    removeClass(aIpt[j], 'validationStyle-failed');
                }
                aIpt[j].value = '';
            })(j);
        }
    }
}

function clearInput(){
    if (this.nextElementSibling.style.display === 'block'){
        this.nextElementSibling.style.display = 'none';
    }
    if (hasClass(this, 'validationStyle-failed')){
        removeClass(this, 'validationStyle-failed');
    }
    if (hasClass(this, 'validationStyle-successed')){
        removeClass(this, 'validationStyle-successed');
    }
}