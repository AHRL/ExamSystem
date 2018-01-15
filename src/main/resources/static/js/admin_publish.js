window.onload = function() {
    pageFinished();
};

function pageFinished() {
    if (!window.localStorage) {
        alert('您的浏览器不支持 localStorage! 建议您升级浏览器或者更换浏览器。');
    } else {
        var storage = window.localStorage;
    }
    console.log(JSON.parse(storage.getItem('examData')));

    var pubInfo = document.getElementsByClassName('publish-info')[0];
    var pubInfoType = document.getElementById('chooseType');
    var pubInfoST = document.getElementById('startTime');
    var pubInfoET = document.getElementById('endTime');
    var pubInfoNote = document.getElementById('infoNotes');

    var pubAddBtn = document.getElementsByClassName('btn-js')[0];
    var cpltBtn = document.getElementById('cpltBtn');
    var submitCfrmBtn = document.getElementById('submitCfrmBtn');
    var toggleBtn = document.getElementById('toggleBtn');
    var toggleFlag = true;

    var examDataObj = {
        basic: {},
        exam: []
    };
    var examDataStr = '';

    var pageTitle = document.getElementsByTagName('h1')[0];
    var pubCon = document.getElementById('publishCon');
    var libCon = document.getElementById('examLibCon');

    if (JSON.parse(storage.getItem('examData'))) {
        alert('你还有考试题目没有发布，请继续');
        var checkExamData = JSON.parse(storage.getItem('examData'));
        pubInfoType.value = checkExamData.basic.type;
        pubInfoST.value = checkExamData.basic.startTime;
        pubInfoET.value = checkExamData.basic.endTime;
        pubInfoNote.value = checkExamData.basic.info;
        removeClass(pubAddBtn, 'disabled');
        pubAddBtn.removeAttribute('disabled');
        removeClass(cpltBtn, 'disabled');
        cpltBtn.removeAttribute('disabled');
    }

    // EventUtil.addHandler(pubInfoType, 'change', checkChoice);
    EventUtil.addHandler(pubInfoNote, 'blur', checkChoice);

    function checkChoice() {
        var typeVal = pubInfoType.value;
        var stVal = pubInfoST.value;
        var etVal = pubInfoET.value;
        var noteVal = pubInfoNote.value;

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
                    if (noteVal && typeVal && ms) {
                        removeClass(pubAddBtn, 'disabled');
                        pubAddBtn.removeAttribute('disabled');

                        examDataObj.basic.type = typeVal;
                        examDataObj.basic.startTime = stVal;
                        examDataObj.basic.endTime = etVal;
                        examDataObj.basic.date = etVal.substr(0, 10);
                        examDataObj.basic.time = ms;
                        examDataObj.basic.info = noteVal;

                        examDataStr = JSON.stringify(examDataObj);
                        storage.setItem('examData', examDataStr);
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
    }

    var examNote = document.getElementsByClassName('exam-note')[0];
    var examCount = document.getElementsByClassName('exam-count')[0];

    EventUtil.addHandler(pubAddBtn, 'click', function(event) {
        event.preventDefault();
        examNote.innerText = JSON.parse(storage.getItem('examData')).basic.info;
        examCount.innerText = JSON.parse(storage.getItem('examData')).exam.length + 1;
    });

    var eType = document.getElementById('examType');
    var eDesc = document.getElementById('examDesc');
    var eCode = document.getElementById('examCode');
    var eAddBtn = document.getElementById('examAddBtn');
    var eRmvBtn = document.getElementById('examRemoveBtn');
    var eCfmBtn = document.getElementById('examConfirmBtn');

    // EventUtil.addHandler(eType, 'change', function() {
    //     storage.setItem('examType', eType.value);
    // });

    // EventUtil.addHandler(eDesc, 'blur', function() {
    //     storage.setItem('examDesc', eDesc.value);
    // });

    // EventUtil.addHandler(eCode, 'blur', function() {
    //     storage.setItem('examCode', eCode.value);
    // });


    // var stChar = 'D';
    // var stASC = stChar.charCodeAt(0);
    // var setChoices = document.getElementsByClassName('set-choices')[0];
    // EventUtil.addHandler(eAddBtn, 'click', function(event) {
    //     event.preventDefault();
    //     stASC++;
    //     var newChar = String.fromCharCode(stASC);
    //     var choices = setChoices.getElementsByTagName('fieldset');
    //     var fieldsetEl = createElement('fieldset', {
    //         "classNames": ["form-group"]
    //     });
    //     var divEl = createElement('div', {
    //         "classNames": ["row"]
    //     });
    //     var labelEl = createElement('label', {
    //         "txt": newChar,
    //         "classNames": ["col-sm-1", "push-sm-1", "form-check-label"]
    //     });
    //     var inputEl = createElement('input', {
    //         "type": "text",
    //         "id": "examChoice-" + newChar,
    //         "name": "examChoice-" + newChar,
    //         "classNames": ["col-sm-9", "push-sm-1", "form-control"],
    //         "autocomplete": "off"
    //     });
    //     fieldsetEl.appendChild(divEl);
    //     divEl.appendChild(labelEl);
    //     divEl.appendChild(inputEl);
    //     setChoices.insertBefore(fieldsetEl, choices[length - 1]);
    //     if (setChoices.getElementsByTagName('fieldset').length === 8) {
    //         this.setAttribute('disabled', 'disabled');
    //         addClass(this, 'disabled');
    //     }
    //     if (setChoices.getElementsByTagName('fieldset').length < 8) {
    //         if (hasClass(this, 'disabled')) {
    //             this.removeAttribute('disabled');
    //             removeClass(this, 'disabled');
    //         }
    //         if (hasClass(eRmvBtn, 'disabled')) {
    //             removeChoiceBtn.removeAttribute('disabled');
    //             removeClass(eRmvBtn, 'disabled');
    //         }
    //     }
    // });

    // EventUtil.addHandler(eRmvBtn, 'click', function(event) {
    //     event.preventDefault();
    //     stASC--;
    //     setChoices.removeChild(setChoices.getElementsByTagName('fieldset')[setChoices.getElementsByTagName('fieldset').length - 2]);
    //     if (setChoices.getElementsByTagName('fieldset').length === 3) {
    //         this.setAttribute('disabled', 'disabled');
    //         addClass(this, 'disabled');
    //     }
    //     if (setChoices.getElementsByTagName('fieldset').length > 3) {
    //         if (hasClass(this, 'disabled')) {
    //             this.removeAttribute('disabled');
    //             removeClass(this, 'disabled');
    //         }
    //         if (hasClass(eAddBtn, 'disabled')) {
    //             addChoiceBtn.removeAttribute('disabled');
    //             removeClass(eAddBtn, 'disabled');
    //         }
    //     }
    // });

    EventUtil.addHandler(eCfmBtn, 'click', function(event) {
        event.preventDefault();
        console.log('beforeAdd :', JSON.parse(storage.getItem('examData')));
        examDataObj = JSON.parse(storage.getItem('examData'));
        examDataObj.exam.push({
            type: '单选',
            desc: '123',
            code: '456',
            choices: [
                'a',
                'b',
                'c',
                'd'
            ]
        });
        console.log('JSONstr', JSON.stringify(examDataObj));
        examDataStr = JSON.stringify(examDataObj);
        storage.setItem('examData', examDataStr);
        console.log('afterAdd :', JSON.parse(storage.getItem('examData')));


        $('#addExam').modal('hide');
        if (hasClass(cpltBtn, 'disabled')) {
            removeClass(cpltBtn, 'disabled');
            cpltBtn.removeAttribute('disabled');
        }
    });

    EventUtil.addHandler(submitCfrmBtn, 'click', function(event) {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/',
            dataType: 'json',
            data: JSON.parse(storage.getItem('examData')),
            success: function(data) {
                storage.removeItem('examData');
                pubInfoType.value = '';
                pubInfoST.value = '';
                pubInfoET.value = '';
                pubInfoNote.value = '';
                addClass(pubAddBtn, 'disabled');
                pubAddBtn.addAttribute('disabled');
                addClass(cpltBtn, 'disabled');
                cpltBtn.addAttribute('disabled');
                alert('提交成功!');
            },
            error: function() {

            }
        });

        // storage.removeItem('examData');
        // pubInfoType.value = '';
        // pubInfoST.value = '';
        // pubInfoET.value = '';
        // pubInfoNote.value = '';
        // addClass(pubAddBtn, 'disabled');
        // pubAddBtn.setAttribute('disabled', 'disabled');
        // addClass(cpltBtn, 'disabled');
        // cpltBtn.setAttribute('disabled', 'disabled');
        // alert('提交成功')
    });

    EventUtil.addHandler(toggleBtn, 'click', function() {
        if (toggleFlag) { // 表示切换到查看考试题库界面
            toggleBtn.innerText = '返回发布考试';
            pageTitle.innerText = '考试题库';
            pubCon.style.display = 'none';
            // 先发起 ajax 请求，再进行页面填充
            $.ajax({
                type: 'POST',
                url: '/',
                dataType: 'json',
                success: function(data) {
                    if (data.is304) { // 则使用 storage 填充页面

                    } else { // 将更新的资源存储到 storage，然后将最新的 storage 填充页面

                    }
                    libCon.style.display = 'block';
                },
                error: function() {
                    console.log('error');
                }
            });
            toggleFlag = false;
        } else { // 表示切换到发布考试界面
            toggleBtn.innerText = '查看考试题库';
            pageTitle.innerText = '发布考试';
            libCon.style.display = 'none';
            pubCon.style.display = 'block';
            toggleFlag = true;
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