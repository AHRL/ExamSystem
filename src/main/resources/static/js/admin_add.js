(function () {
    var script = document.createElement('script');
    var __dirPath = '../static/js/';
    script.setAttribute('src', __dirPath + 'funLib.js');
    document.head.appendChild(script);
})();
window.onload = function () {
    pageFinished();
};

function pageFinished() {
    var chooseType = document.getElementById('chooseType');
    var typeRadios = chooseType.getElementsByTagName('input');
    var chooseLang = document.getElementById('chooseLang');
    var langRadios = chooseLang.getElementsByTagName('input');
    var setInfo = document.getElementById('setInfo');
    var setChoices = document.getElementById('setChoices');
    var forDisabled = setChoices.getElementsByClassName('forDisabled')[0];
    var confirmAdd = document.getElementById('confirmAdd');
    var wrap = document.getElementById('wrap');

    var addInfo = document.getElementsByClassName('add-info')[0];
    var addInfoBtns = addInfo.getElementsByTagName('button');
    var sureBtn = addInfoBtns[0];
    var resetBtn = addInfoBtns[1];
    var addText = document.getElementsByClassName('add-text')[0];

    var addCodeForExInfoBox = document.getElementById('addCodeForExInfoBox');
    var addCodeForExInfo = document.getElementById('addCodeForExInfo');
    var addCodeBtn = document.getElementById('addCodeBtn');
    var removeCodeBtn = createElement('button', {
        "id": "removeCodeBtn",
        "txt": "取消",
        "classNames": ["btn", "btn-danger"]
    });

    var addChoiceBtn = document.getElementById('addChoiceBtn');
    var removeChoiceBtn = document.getElementById('removeChoiceBtn');

    HTMLCollection.prototype.map=function(callback){
        [].slice.call(this).map(callback);
    };
    HTMLCollection.prototype.some=function(callback){
        [].slice.call(this).some(callback);
    };

    (function () {
        var chooseTypeItems = [],
            chooseLangItems = [];
        typeRadios.map(function (t) {
            EventUtil.addHandler(t, 'click', function () {
                if (chooseTypeItems.length){
                    chooseTypeItems.shift();
                }
                chooseTypeItems.push(t.value);
                insertStr(addText, chooseTypeItems, chooseLangItems);
                addClass(t, 'checked');
            });
        });
        langRadios.map(function (t) {
            EventUtil.addHandler(t, 'click', function () {
                if (chooseLangItems.length){
                    chooseLangItems.shift();
                }
                chooseLangItems.push(t.value);
                insertStr(addText, chooseTypeItems, chooseLangItems);
                addClass(t, 'checked');
            });
        });

        function insertStr(el, arr1, arr2){
            el.innerHTML = '您已选择：' + arr1.concat(arr2).join(' | ');
        }
        var lenT = typeRadios.length,
            lenL = langRadios.length;
        EventUtil.addHandler(sureBtn, 'click', function (event) {
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
                slideDown(wrap, 500);
            } else {
                alert('请您先选择！');
                return false;
            }
            var bool1 = false,
                bool2 = false;
            if (typeRadios[0].checked === true){
                bool1 = true;
            }
            if (typeRadios[1].checked === true){
                bool2 = true;
            }
            if (bool1 || bool2){
                forDisabled.style.display = 'none';
            } else {
                forDisabled.style.display = 'block';
            }
            for (var m=0; m<lenT; m++){
                typeRadios[m].setAttribute('disabled', 'true');
                addClass(typeRadios[m],'disabled');
            }
            for (var n=0; n<lenL; n++){
                langRadios[n].setAttribute('disabled', 'true');
                addClass(langRadios[n], 'disabled');
            }
            this.setAttribute('disabled', 'true');
            addClass(this, 'disabled');
            resetBtn.removeAttribute('disabled');
            removeClass(resetBtn, 'disabled');
        });
        EventUtil.addHandler(resetBtn, 'click', function () {
            slideUp(wrap, 100);
            for (var i=0; i<lenT; i++){
                typeRadios[i].checked = false;
                typeRadios[i].removeAttribute('disabled');
                removeClass(typeRadios[i], 'disabled');
            }
            for (var j=0; j<lenL; j++){
                langRadios[j].checked = false;
                langRadios[j].removeAttribute('disabled');
                removeClass(langRadios[j], 'disabled');
            }
            addText.innerHTML = '请您先选择题目类型和语言：';
            this.setAttribute('disabled', 'disabled');
            addClass(this, 'disabled');
            sureBtn.removeAttribute('disabled');
            removeClass(sureBtn, 'disabled');
            if (addCodeForExInfoBox.style.display !== 'none'){
                addCodeForExInfoBox.style.display = 'none';
                setInfo.replaceChild(addCodeBtn, removeCodeBtn);
            }
        });

        // step3 Set Information
        var targetChild = setInfo.getElementsByTagName('fieldset')[1];
        EventUtil.addHandler(addCodeBtn, 'click', function (event) {
            event.preventDefault();
            slideDown(addCodeForExInfoBox, 300);
            targetChild.replaceChild(removeCodeBtn, addCodeBtn);
        });
        EventUtil.addHandler(removeCodeBtn, 'click', function (event) {
            event.preventDefault();
            slideUp(addCodeForExInfoBox, 300);
            targetChild.replaceChild(addCodeBtn, removeCodeBtn);
            if (addCodeForExInfo.value){
                addCodeForExInfo.value = '';
            }
        });
        var setInfoIpt = setInfo.getElementsByTagName('input')[0];
        EventUtil.addHandler(setInfoIpt, 'blur', function () {
            if (!this.value){
                showTip.call(this.nextElementSibling, '题目描述不能为空！');
            }
        });
        EventUtil.addHandler(setInfoIpt, 'focus', function () {
            clearInput.call(this);
        });

        // step4 Set Choices
        var beginStr = 'D';
        var code = beginStr.charCodeAt(0);
        EventUtil.addHandler(addChoiceBtn, 'click', function (event) {
            event.preventDefault();
            code++;
            var newCode = String.fromCharCode(code);
            var fieldset = createElement('fieldset', {
                "classNames": ["form-group"]
            });
            var label = createElement('label', {
                "txt": newCode,
                "classNames": ["form-control-label"]
            });
            var input = createElement('input', {
                "id": "singleC_" + newCode,
                "name": "singleC_" +  newCode,
                "classNames": ["form-control", "form-control-lg"]
            });
            var fieldSets = setChoices.getElementsByTagName('fieldset');
            fieldset.appendChild(label);
            fieldset.appendChild(input);
            setChoices.insertBefore(fieldset, fieldSets[fieldSets.length-1]);
            if (setChoices.getElementsByTagName('fieldset').length === 9){
                this.setAttribute('disabled', 'disabled');
                addClass(this, 'disabled');
            }
            if (setChoices.getElementsByTagName('fieldset').length < 9){
                if (hasClass(this, 'disabled')){
                    this.removeAttribute('disabled');
                    removeClass(this, 'disabled');
                }
                if (hasClass(removeChoiceBtn, 'disabled')){
                    removeChoiceBtn.removeAttribute('disabled');
                    removeClass(removeChoiceBtn, 'disabled');
                }
            }
        });
        EventUtil.addHandler(removeChoiceBtn, 'click', function (event) {
            event.preventDefault();
            code--;
            setChoices.removeChild(setChoices.getElementsByTagName('fieldset')[setChoices.getElementsByTagName('fieldset').length-2]);
            if (setChoices.getElementsByTagName('fieldset').length === 3){
                this.setAttribute('disabled', 'disabled');
                addClass(this, 'disabled');
            }
            if (setChoices.getElementsByTagName('fieldset').length > 3){
                if (hasClass(this, 'disabled')){
                    this.removeAttribute('disabled');
                    removeClass(this, 'disabled');
                }
                if (hasClass(addChoiceBtn, 'disabled')){
                    addChoiceBtn.removeAttribute('disabled');
                    removeClass(addChoiceBtn, 'disabled');
                }
            }
        });

        // step5 Ensure
        var confirmAddBtn = confirmAdd.getElementsByTagName('button')[0];
        var pswdIpt = confirmAdd.getElementsByTagName('input')[0];
        var exInfo = document.getElementById('ex-info');
        var setChoicesIpts = setChoices.getElementsByTagName('input');
        var sCILen = setChoicesIpts.length;
        EventUtil.addHandler(pswdIpt, 'blur', function () {
            var val = this.value;
            var len = val.length;
            if (len>=8 && len<=16){
                $.ajax({
                    type: 'POST',
                    url: '',
                    data: {
                        "password": val
                    },
                    success: function () {

                    },
                    error: function () {

                    }
                });
            } else {
                showTip.call(this.nextElementSibling, '密码不符合要求！');
            }
        });
        EventUtil.addHandler(pswdIpt, 'focus', function () {
            clearInput.call(this);
        });
        EventUtil.addHandler(confirmAddBtn, 'click', function (event) {
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
            if (setChoicesIpts[0].value){
                for (var k=0; k<sCILen; k++){
                    jsonObj.choices[k] = setChoicesIpts[k].value;
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

