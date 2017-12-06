(function() {
    var script = document.createElement('script');
    var __dirPath = '../static/js/';
    script.setAttribute('src', __dirPath + 'funLib.js');
    document.head.appendChild(script);
})();
window.onload = function() {
    pageFinished();
};

function pageFinished() {
    if (!window.localStorage) {
        alert('您的浏览器不支持 localStorage! 建议您升级浏览器或者更换浏览器。');
    } else {
        var storage = window.localStorage;
    }

    console.log(storage);

    var pubInfo = document.getElementsByClassName('publish-info')[0];
    var pubInfoType = document.getElementById('chooseType');
    var pubInfoST = document.getElementById('startTime');
    var pubInfoET = document.getElementById('endTime');
    var pubInfoNote = document.getElementById('infoNotes');

    var pubAddBtn = document.getElementsByClassName('publish-add')[0];

    EventUtil.addHandler(pubInfoNote, 'blur', function() {
        console.log(pubInfoST.value);
        console.log(pubInfoET.value);

        var typeVal = pubInfoType.value;
        var stVal = pubInfoST.value;
        var etVal = pubInfoET.value;
        var noteVal = pubInfoNote.value;

        console.log(noteVal);

        function getTime(sh, eh, sm, em) {
            var time = (eh - sh) * 60 + (em - sm);
            if (time <= 0) {
                alert('选择时间有误！');
                return;
            }
            return time * 60 * 1000;
        }

        if (typeVal) {
            if (stVal) {
                var stHour = stVal.substr(-5, 2);
                var stMinu = stVal.substr(-2, 2);
                if (etVal) {
                    var etHour = etVal.substr(-5, 2);
                    var etMinu = etVal.substr(-2, 2);
                    var ms = getTime(stHour, etHour, stMinu, etMinu);
                    if (noteVal) {
                        pubAddBtn.style.visibility = 'visible';

                        console.log(noteVal);
                        storage.setItem('infoType', typeVal);
                        storage.setItem('infoTime', ms);
                        storage.setItem('infoNote', noteVal);
                    } else {
                        alert('请填写备注');
                    }
                } else {
                    alert('请选择结束时间');
                }
            } else {
                alert('请选择开始时间');
            }
        } else {
            alert('请选择考试类型');
        }
    });

    var examNums = 0;
    var examNote = document.getElementsByClassName('exam-note')[0];
    var examCount = pubInfo.getElementsByClassName('exam-count');

    EventUtil.addHandler(pubAddBtn, 'click', function(event) {
        event.preventDefault();
        console.log(storage.getItem('infoNote'));
        examNote.innerHTML = storage.getItem('infoNote');
    });

    var eType = document.getElementById('examType');
    var eDesc = document.getElementById('examDesc');
    var eCode = document.getElementById('examCode');
    var eAddBtn = document.getElementById('examAddBtn');
    var eRmvBtn = document.getElementById('examRemoveBtn');
    var eCfmBtn = document.getElementById('examConfirmBtn');

    EventUtil.addHandler(eType, 'change', function() {
        storage.setItem('examType', eType.value);
    });

    EventUtil.addHandler(eDesc, 'blur', function() {
        storage.setItem('examDesc', eDesc.value);
    });

    EventUtil.addHandler(eCode, 'blur', function() {
        storage.setItem('examCode', eCode.value);
    });


    var stChar = 'D';
    var stASC = stChar.charCodeAt(0);
    var setChoices = document.getElementsByClassName('set-choices')[0];
    EventUtil.addHandler(eAddBtn, 'click', function(event) {
        event.preventDefault();
        stASC++;
        var newChar = String.fromCharCode(stASC);
        var choices = setChoices.getElementsByTagName('fieldset');
        var fieldsetEl = createElement('fieldset', {
            "classNames": ["form-group"]
        });
        var divEl = createElement('div', {
            "classNames": ["row"]
        });
        var labelEl = createElement('label', {
            "txt": newChar,
            "classNames": ["col-sm-1", "push-sm-1", "form-check-label"]
        });
        var inputEl = createElement('input', {
            "type": "text",
            "id": "examChoice-" + newChar,
            "name": "examChoice-" + newChar,
            "classNames": ["col-sm-9", "push-sm-1", "form-control"],
            "autocomplete": "off"
        });
        fieldsetEl.appendChild(divEl);
        divEl.appendChild(labelEl);
        divEl.appendChild(inputEl);
        setChoices.insertBefore(fieldsetEl, choices[length - 1]);
        if (setChoices.getElementsByTagName('fieldset').length === 8) {
            this.setAttribute('disabled', 'disabled');
            addClass(this, 'disabled');
        }
        if (setChoices.getElementsByTagName('fieldset').length < 8) {
            if (hasClass(this, 'disabled')) {
                this.removeAttribute('disabled');
                removeClass(this, 'disabled');
            }
            if (hasClass(eRmvBtn, 'disabled')) {
                removeChoiceBtn.removeAttribute('disabled');
                removeClass(eRmvBtn, 'disabled');
            }
        }
    });

    EventUtil.addHandler(eRmvBtn, 'click', function(event) {
        event.preventDefault();
        stASC--;
        setChoices.removeChild(setChoices.getElementsByTagName('fieldset')[setChoices.getElementsByTagName('fieldset').length - 2]);
        if (setChoices.getElementsByTagName('fieldset').length === 3) {
            this.setAttribute('disabled', 'disabled');
            addClass(this, 'disabled');
        }
        if (setChoices.getElementsByTagName('fieldset').length > 3) {
            if (hasClass(this, 'disabled')) {
                this.removeAttribute('disabled');
                removeClass(this, 'disabled');
            }
            if (hasClass(eAddBtn, 'disabled')) {
                addChoiceBtn.removeAttribute('disabled');
                removeClass(eAddBtn, 'disabled');
            }
        }
    });

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
    if (jsonObj) {
        if (jsonObj.id) {
            element.id = jsonObj.id;
        }
        if (jsonObj.txt) {
            element.innerHTML = jsonObj.txt;
        }
        if (jsonObj.classNames) {
            addClass(element, jsonObj.classNames.join(' '));
        }
        if (jsonObj.type) {
            element.setAttribute('type', jsonObj.type);
        }
        if (jsonObj.autocomplete) {
            element.setAttribute('autocomplete', jsonObj.autocomplete);
        }
        return element;
    }
    return element;
}