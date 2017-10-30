window.onload = function () {
    pageFinished();
};

function pageFinished() {
    var addForm = document.getElementById('addForm');
    var type = document.getElementById('cType');
    var lang = document.getElementById('cLang');
    var info = document.getElementById('cInfo');

    var typeRadios = type.getElementsByTagName('input');
    var langRadios = lang.getElementsByTagName('input');
    var tLen = typeRadios.length;
    var lLen = langRadios.length;
    HTMLCollection.prototype.map=function(callback){
        [].slice.call(this).map(callback);
    };
    HTMLCollection.prototype.some=function(callback){
        [].slice.call(this).some(callback);
    };

    (function () {
        var choosedTypeItems = [];
        var choosedLangItems = [];

        typeRadios.map(function (t) {
            EventUtil.addHandler(t, 'click', function () {
                var flag = 1;
                
                var con = document.getElementsByClassName('choosedCon');
                // t.setAttribute('disabled', 'true');
                if (choosedTypeItems.length){
                    choosedTypeItems.shift();
                }
                choosedTypeItems.push(t.value);
                insertStr(section, choosedTypeItems, choosedLangItems);

            });
        });
        langRadios.map(function (t) {
            EventUtil.addHandler(t, 'click', function () {

                // t.setAttribute('disabled', 'true');
                if (choosedLangItems.length){
                    choosedLangItems.shift();
                }
                choosedLangItems.push(t.value);
                insertStr(section, choosedTypeItems, choosedLangItems);
                /*if (typeRadios[0].checked || typeRadios[1].checked){
                    var setChoices = document.getElementById('setChoices');
                    setChoices.style.display = 'block';
                }*/
            });
        });


            var div = createElement('div', {
                "classNames": ["choosedCon"]
            });
            var section = createElement('section', {
                "id": "choosedItem",
                "txt": "您已选择：",
                "classNames": ["choosedItem", "h5"]
            });
            var btn = createElement('button', {
                "id": "",
                "txt": "确定",
                "classNames": ['btn', 'btn-primary', 'btn-lg', 'choosedBtn']
            });
            div.appendChild(section);
            div.appendChild(btn);
            addForm.insertBefore(div, info);
            function insertStr(el, arr1, arr2){
                el.innerHTML = '您已选择：' + arr1.concat(arr2).join(' | ');
            }


        
        
        EventUtil.addHandler(btn, 'click', function (event) {
            event.preventDefault();
            alert(info.style.height);
        });



    })();
}

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
        return false;
    }
}


// create Function createElement()
/*
* @param: el String
* @param: jsonObj JSON
* @return: HTML Object
*
* */
function createElement(el, jsonObj) {
    var element = document.createElement(el);
    if (jsonObj){
        if (jsonObj.id){
            element.id = jsonObj.id;
        }
        if (jsonObj.txt){
            element.innerHTML = jsonObj.txt;
        }
        if (jsonObj.classNames){
            addClass(element, jsonObj.classNames.join(' '));
        }
        return element;
    }
}

