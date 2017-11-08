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
                // var flag = 1;
                //
                // var con = document.getElementsByClassName('choosedCon');
                // t.setAttribute('disabled', 'true');
                if (choosedTypeItems.length){
                    choosedTypeItems.shift();
                }
                choosedTypeItems.push(t.value);
                insertStr(section, choosedTypeItems, choosedLangItems);
                addClass(t, 'checked');
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
                addClass(t, 'checked');
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
            "classNames": ['btn', 'btn-primary', 'btn-lg']
        });
        var btnCancel = createElement('button', {
            "id": "",
            "txt": "重新选择",
            "classNames": ['btn', 'btn-warning', 'btn-lg']
        });
        var btnGroup = createElement('div',{
            "classNames": ['choosedBtn']
        });
        div.appendChild(section);
        div.appendChild(btnGroup);
        btnGroup.appendChild(btn);
        btnGroup.appendChild(btnCancel);
        addForm.insertBefore(div, info);
        function insertStr(el, arr1, arr2){
            el.innerHTML = '您已选择：' + arr1.concat(arr2).join(' | ');
        }
        var lenT = typeRadios.length,
            lenL = langRadios.length;
        EventUtil.addHandler(btn, 'click', function (event) {
            event.preventDefault();
            var flagT = false,
                flagL = false;
            for (var i=0; i<lenT; i++){
                if (typeRadios[i].checked === true){
                    flagT = true;
                }
            }
            for (var j=0; j<lenL; j++){
                if (langRadios[j].checked === true){
                    flagL = true;
                }
            }
            if (flagT&&flagL){
                slideDown(info, 500);
            } else {
                alert('请您先选择！');
                return false;
            }
            var bool1 = false,
                bool2 = false;
            var choicesPanel = document.getElementById('choicesPanel');
            if (typeRadios[0].checked === true){
                bool1 = true;
            }
            if (typeRadios[1].checked === true){
                bool2 = true;
            }
            if (bool1 || bool2){
                choicesPanel.style.display = 'block';
            }
            for (var m=0; m<lenT; m++){
                typeRadios[m].setAttribute('disabled', 'true');
                addClass(typeRadios[m],'disabled');
            }
            for (var n=0; n<lenL; n++){
                langRadios[n].setAttribute('disabled', 'true');
                addClass(langRadios[n], 'disabled');
            }
            btn.setAttribute('disabled', 'true');
            addClass(btn, 'disabled');
            btnCancel.removeAttribute('disabled');
            removeClass(btnCancel, 'disabled');
        });
        btnCancel.setAttribute('disabled', 'true');
        addClass(btnCancel, 'disabled');
        EventUtil.addHandler(btnCancel, 'click', function () {
            slideUp(info, 500);
            for (var i=0; i<lenT; i++){
                typeRadios[i].removeAttribute('disabled');
                removeClass(typeRadios[i], 'disabled');
            }
            for (var j=0; j<lenL; j++){
                langRadios[j].removeAttribute('disabled');
                removeClass(langRadios[j], 'disabled');
            }
            btnCancel.setAttribute('disabled', 'true');
            addClass(btnCancel, 'disabled');
            btn.removeAttribute('disabled');
            removeClass(btn, 'disabled');
            var choicesPanel = document.getElementById('choicesPanel');
            if (choicesPanel.style.display !== 'none'){
                choicesPanel.style.display = 'none';
            }
            var addCodeForExInfoBox = document.getElementById('addCodeForExInfoBox');
            if (addCodeForExInfoBox.style.display !== 'none'){
                addCodeForExInfoBox.style.display = 'none';
                info.replaceChild(addCodeBtn, removeCodeBtn);
            }
        });

        var addCodeForExInfoBox = document.getElementById('addCodeForExInfoBox');
        var addCodeBtn = document.getElementById('addCodeBtn');
        EventUtil.addHandler(addCodeBtn, 'click', function (event) {
            event.preventDefault();
            slideDown(addCodeForExInfoBox, 300);
            info.replaceChild(removeCodeBtn, addCodeBtn);
        });
        var removeCodeBtn = createElement('button', {
            "id": "removeCodeBtn",
            "txt": "取消添加代码<i class=\"fa fa-remove-sign fa-2x\"></i>",
            "classNames": ["btn", "btn-block", "btn-danger", "btn-lg"]
        });
        EventUtil.addHandler(removeCodeBtn, 'click', function (event) {
            event.preventDefault();
            slideUp(addCodeForExInfoBox, 300);
            info.replaceChild(addCodeBtn, removeCodeBtn);
        });

        var addChoiceBtn = document.getElementById('addChoiceBtn');
        var choicesPanel = document.getElementById('choicesPanel');
        var str = 'D';
        var code = str.charCodeAt(0);
        EventUtil.addHandler(addChoiceBtn, 'click', function (event) {
            event.preventDefault();
            code++;
            var newCode = String.fromCharCode(code);
            var div = createElement('div');
            var label = createElement('label', {
                "txt": newCode,
                "classNames": ["form-control-label"]
            });
            var input = createElement('input', {
                "id": "singleC_" + newCode,
                "name": "singleC_" +  newCode,
                "classNames": ["form-control", "form-control-lg"]
            });
            choicesPanel.insertBefore(div, addChoiceBtn);
            div.appendChild(label);
            div.appendChild(input);
        });

        var ensureBtn = document.getElementById('ensureBtn');
        var exInfo = document.getElementById('ex-info');
        var addCodeForExInfo = document.getElementById('addCodeForExInfo');
        var choicesPanel = document.getElementById('choicesPanel');
        var choicesPanelInputs = choicesPanel.getElementsByTagName('input');
        var cPILen = choicesPanelInputs.length;
        EventUtil.addHandler(ensureBtn, 'click', function (event) {
            event.preventDefault();
            var jsonObj = {
                "type": "",
                "lang": "",
                "info": "",
                "code": "",
                "choices": []
            };
            for (var i=0; i<lenT; i++){
                if (typeRadios[i].checked === true){
                    jsonObj.type = typeRadios[i].value;
                }
            }
            for (var j=0; j<lenL; j++){
                if (langRadios[j].checked === true){
                    jsonObj.lang = langRadios[j].value;
                }
            }
            jsonObj.info = exInfo.value;
            if (addCodeForExInfo.value){
                jsonObj.code = addCodeForExInfo.value;
            }
            if (choicesPanelInputs[0].value){
                for (var k=0; k<cPILen; k++){
                    jsonObj.choices[k] = choicesPanelInputs[k].value;
                }
            }
            console.log(jsonObj);
            var url = formatParams(jsonObj);
            console.log(url);
            if (exInfo.value){
                console.log(jsonObj);
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8080/add',
                    dataType: 'json',
                    data: url,
                    success: function (data, textStatus, jqXHR) {
                        console.log('成功添加题库' + data);
                    },
                    error: function (jqXHR, textStatus, error) {
                        console.log('error' + textStatus);
                    }
                });
            } else {
                console.log('fail');
            }

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
    return element;
}

function slideUp(el, time){
    var totalHeight = el.offsetHeight;
    var currentHeight = totalHeight;
    var decrement = totalHeight/(time/10);
    var timer = setInterval(function () {
        currentHeight -= decrement;
        el.style.height = currentHeight + 'px';
        if (currentHeight<=0){
            clearInterval(timer);
            el.style.display = 'none';
            el.style.height = totalHeight + 'px';
        }
    }, 10);
}
function slideDown(el, time) {
    el.style.display = 'block';  // show
    // el.style.overflow = 'hidden';  // position:relative
    var totalHeight = el.offsetHeight;  // get element total height
    el.style.height = '0';  // hidden
    var currentHeight = 0;  // current height
    var increment = totalHeight/(time/10);  // per increment
    var timer = setInterval(function () {
        currentHeight += increment;
        el.style.height = currentHeight + 'px';
        if (currentHeight>=totalHeight){
            clearInterval(timer);
            el.style.height = totalHeight + 'px';
        }
    }, 10);
}

function formatParams(data) {
    var arr = [];
    arr.push('?');
    for (var name in data){
        if (data.hasOwnProperty(name)){
            arr.push( encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
        }
    }
    console.log(arr);
    return arr.join('&');
}

