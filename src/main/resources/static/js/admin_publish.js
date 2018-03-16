window.onload = function() {
    //getCurrentDate();
    pageFinished();

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
            if (jsonObj.for) {
                element.setAttribute('for', jsonObj.for)
            }
            return element;
        }
        return element;
    }

    function getCurrentDate() {
        var now = new Date();

        var year = now.getFullYear();
        var nextYear = year + 1;
        var month = now.getMonth() + 1; // 1 2 3 4 5 6 7 8 9 10 11 12
        var nextMonth = month % 12 + 1; // 2 3 4 5 6 7 8 9 10 11 12 1
        var date = now.getDate();
        var nextDateArr = [];

        function calNextDateArr(date, days) {
            return [
                date,
                date % days + 1,
                (date + 1) % days + 1,
                (date + 2) % days + 1,
                (date + 3) % days + 1,
                (date + 4) % days + 1,
                (date + 5) % days + 1
            ];
        }

        if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) { // 31天
            nextDateArr = calNextDateArr(date, 31);
        } else if (month === 2) {
            if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) { // 29天
                nextDateArr = calNextDateArr(date, 29)
            } else { // 28天
                nextDateArr = calNextDateArr(date, 28);
            }
        } else { // 30天
            nextDateArr = calNextDateArr(date, 30);
        }

        console.log(year, nextYear, month, nextMonth, date, nextDateArr);
    }

    function createDateSelect(id) {
        var optionArr = Array.prototype.slice.call(id.getElementsByTagName('option'));
        optionArr[1].value = year;
        optionArr[1].innerText = year;
        optionArr[2].value = nextYear;
        optionArr[2].innerText = nextYear;
    }
};

function pageFinished() {
    if (!window.localStorage) {
        alert('您的浏览器不支持 localStorage! 建议您升级浏览器或者更换浏览器。');
    } else {
        var storage = window.localStorage;
    }
    console.log(JSON.parse(storage.getItem('examData')));

    var pubInfo = document.getElementsByClassName('publish-info')[0];

    var chooseType = document.getElementById('chooseType');
    var chooseYear = document.getElementById('chooseYear');
    var chooseMonth = document.getElementById('chooseMonth');
    var chooseDay = document.getElementById('chooseDay');
    var chooseSHour = document.getElementById('chooseSHour');
    var chooseSMin = document.getElementById('chooseSMin');
    var chooseEHour = document.getElementById('chooseEHour');
    var chooseEMin = document.getElementById('chooseEMin');
    var chooseLocation = document.getElementById('chooseLocation');
    var explicitLocation = document.getElementById('explicitLocation');
    var isInnerExam = document.getElementById('isInnerExam');
    var infoNotes = document.getElementById('infoNotes');

    var pubAddBtn = document.getElementsByClassName('btn-js')[0];
    var pubCpltBtn = document.getElementById('cpltBtn');
    var pubClearBtn = document.getElementById('clearBtn')
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
        chooseType.value = checkExamData.basic.type;
        chooseYear.value = checkExamData.basic.date.slice(0, 4);
        chooseMonth.value = checkExamData.basic.date.slice(5, 7);
        chooseDay.value = checkExamData.basic.date.slice(8);
        chooseSHour.value = checkExamData.basic.startTime.slice(0, 2);
        chooseSMin.value = checkExamData.basic.startTime.slice(3);
        chooseEHour.value = checkExamData.basic.endTime.slice(0, 2);
        chooseEMin.value = checkExamData.basic.endTime.slice(3);

        if (checkExamData.basic.location === '明理楼C1011' || checkExamData.basic.location === '明理楼B区4楼') {
            chooseLocation.value = checkExamData.basic.location;
        } else {
            explicitLocation.value = checkExamData.basic.location;
        }

        infoNotes.value = checkExamData.basic.info;
        removeClass(pubAddBtn, 'disabled');
        pubAddBtn.removeAttribute('disabled');
        removeClass(pubCpltBtn, 'disabled');
        pubCpltBtn.removeAttribute('disabled');
        removeClass(pubClearBtn, 'disabled');
        pubClearBtn.removeAttribute('disabled');
    }

    EventUtil.addHandler(infoNotes, 'keyup', checkChoice);

    function checkChoice() {
        var typeVal = chooseType.value;
        var shVal = chooseSHour.value;
        var ehVal = chooseEHour.value;
        var noteVal = infoNotes.value;

        if (!typeVal) {
            alert('提示：您还未选择考试类型');
        } else if (!shVal || !ehVal) {
            alert('提示：您还未请选择考试时间');
        } else {
            console.log(noteVal);
            if (noteVal) {
                removeClass(pubAddBtn, 'disabled');
                pubAddBtn.removeAttribute('disabled');
            } else {
                if (!hasClass(pubAddBtn, 'disabled')) {
                    addClass(pubAddBtn, 'disabled');
                    pubAddBtn.setAttribute('disabled', 'disabled');
                }
            }
        }
    }

    function calMS(sh, sm, eh, em) {
        var ms = 0;
        sh = parseInt(sh);
        sm = parseInt(sm);
        eh = parseInt(eh);
        em = parseInt(em);
        if (eh < sh) {
            return 0;
        } else {
            if (em < sm) {
                return 0;
            } else {
                ms = (eh - sh) * 3600000 + (em - sm) * 60000;
            }
        }
        return ms;
    }

    var eType = document.getElementById('examType');
    var eTitle = document.getElementById('examTitle');
    var eCode = document.getElementById('examCode');
    var eAddBtn = document.getElementById('examAddBtn');
    var eRmvBtn = document.getElementById('examRemoveBtn');
    var eCfmBtn = document.getElementById('examConfirmBtn');
    var setChoices = document.getElementsByClassName('set-choices')[0];

    var closeExamModal = document.getElementById('closeExamModal');
    EventUtil.addHandler(closeExamModal, 'click', clearExamModal);

    (function() {
        var examNote = document.getElementsByClassName('exam-note')[0];
        var examCount = document.getElementsByClassName('exam-count')[0];

        EventUtil.addHandler(pubAddBtn, 'click', function(event) {
            event.preventDefault();
            var typeVal = chooseType.value;
            var yearVal = chooseYear.value;
            var monthVal = chooseMonth.value;
            var dayVal = chooseDay.value;
            var shVal = chooseSHour.value;
            var smVal = chooseSMin.value;
            var ehVal = chooseEHour.value;
            var emVal = chooseEMin.value;
            var locVal = chooseLocation.value;
            var eLocVal = explicitLocation.value;
            var isInnerVal;
            if (isInnerExam.checked) {
                isInnerVal = true;
            } else {
                isInnerVal = false;
            }
            var noteVal = infoNotes.value;

            var ms = calMS(shVal, smVal, ehVal, emVal);

            examDataObj.basic.type = typeVal;
            examDataObj.basic.date = yearVal + '-' + monthVal + '-' + dayVal;
            examDataObj.basic.startTime = shVal + ':' + smVal;
            examDataObj.basic.endTime = ehVal + ':' + emVal;
            examDataObj.basic.time = ms;
            examDataObj.basic.isInner = isInnerVal;
            examDataObj.basic.info = noteVal;

            if (eLocVal) { // 如果精确地点（自定义）不为空，则使用精确地点
                examDataObj.basic.location = eLocVal;
            } else { // 否则使用默认选择地点
                examDataObj.basic.location = locVal;
            }

            examDataStr = JSON.stringify(examDataObj);
            storage.setItem('examData', examDataStr);
            examNote.innerText = JSON.parse(storage.getItem('examData')).basic.info;
            examCount.innerText = JSON.parse(storage.getItem('examData')).exam.length + 1;
        });

        var stChar = 'D';
        var stASC = stChar.charCodeAt(0);
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
                "classNames": ["col-sm-1", "push-sm-1", "form-check-label"],
                "for": "examChoice" + newChar
            });
            var inputEl = createElement('input', {
                "type": "text",
                "id": "examChoice" + newChar,
                "name": "examChoice" + newChar,
                "classNames": ["col-sm-9", "push-sm-1", "form-control", "choiceIpt"],
                "autocomplete": "off"
            });
            fieldsetEl.appendChild(divEl);
            divEl.appendChild(labelEl);
            divEl.appendChild(inputEl);
            setChoices.insertBefore(fieldsetEl, choices[length - 1]);
            if (setChoices.getElementsByTagName('fieldset').length === 6) {
                this.setAttribute('disabled', 'disabled');
                addClass(this, 'disabled');
            }
            if (setChoices.getElementsByTagName('fieldset').length < 6) {
                if (hasClass(this, 'disabled')) {
                    this.removeAttribute('disabled');
                    removeClass(this, 'disabled');
                }
                if (hasClass(eRmvBtn, 'disabled')) {
                    eRmvBtn.removeAttribute('disabled');
                    removeClass(eRmvBtn, 'disabled');
                }
            }
        });

        EventUtil.addHandler(eRmvBtn, 'click', function(event) {
            event.preventDefault();
            stASC--;
            setChoices.removeChild(setChoices.getElementsByTagName('fieldset')[setChoices.getElementsByTagName('fieldset').length - 1]);
            if (setChoices.getElementsByTagName('fieldset').length === 2) {
                this.setAttribute('disabled', 'disabled');
                addClass(this, 'disabled');
            }
            if (setChoices.getElementsByTagName('fieldset').length > 2) {
                if (hasClass(this, 'disabled')) {
                    this.removeAttribute('disabled');
                    removeClass(this, 'disabled');
                }
                if (hasClass(eAddBtn, 'disabled')) {
                    eAddBtn.removeAttribute('disabled');
                    removeClass(eAddBtn, 'disabled');
                }
            }
        });
    }());

    function quickExamModal() {
        $('#addExam').modal('hide');
        clearExamModal();
    }

    function clearExamModal() {
        eType.value = '';
        eTitle.value = '';
        eCode.value = '';
        var choiceIpt = setChoices.getElementsByClassName('choiceIpt');
        for (var i = 0; i < choiceIpt.length; i++) {
            choiceIpt[i].value = ''
        }
    }

    function isEmptyExamModal() {
        var choiceIpt = setChoices.getElementsByClassName('choiceIpt');
        if (eType.value && eTitle.value) {
            if ((eType.value === '单选' || eType.value === '多选') && (!choiceIpt[0].value || !choiceIpt[1].value)) {
                return true;
            }
            return false;
        }
        return true;
    }

    function getExamChoice() {
        var examChoicesArr = Array.prototype.slice.call(setChoices.getElementsByClassName('choiceIpt'));
        var valOfExamChoicesArr = [];
        for (var i = 0; i < examChoicesArr.length; i++) {
            valOfExamChoicesArr.push(examChoicesArr[i].value);
        }
        return valOfExamChoicesArr;
    }

    EventUtil.addHandler(eCfmBtn, 'click', function(event) {
        event.preventDefault();
        var isEmpty = isEmptyExamModal();

        var valOfExamChoices = [];

        if (isEmpty) {
            alert('您的题目信息还没填完！')
        } else {
            valOfExamChoices = getExamChoice().toString();

            console.log('beforeAdd :', JSON.parse(storage.getItem('examData')));
            examDataObj = JSON.parse(storage.getItem('examData'));
            examDataObj.exam.push({
                type: eType.value,
                title: eTitle.value,
                code: eCode.value,
                choices: valOfExamChoices
            });
            console.log('JSONstr', JSON.stringify(examDataObj));
            examDataStr = JSON.stringify(examDataObj);
            storage.setItem('examData', examDataStr);
            console.log('afterAdd :', JSON.parse(storage.getItem('examData')));

            if (hasClass(pubCpltBtn, 'disabled')) {
                removeClass(pubCpltBtn, 'disabled');
                pubCpltBtn.removeAttribute('disabled');
            }
            quickExamModal();
        }
    });

    function checkToken() {

    }

    EventUtil.addHandler(submitCfrmBtn, 'click', function(event) {
        event.preventDefault();

        var examToken = document.getElementById('examToken');
        examDataObj.basic.token = examToken.value;
        examDataStr = JSON.stringify(examDataObj);
        storage.setItem('examData', examDataStr);

        if (!examToken.value) {
            alert('密钥不正确！');
        } else {
            $('#submitModal').modal('hide');
            $.ajax({
                type: 'GET',
                url: 'http://127.0.0.1/exam_add',
                dataType: '',
                data: {
                    examData: JSON.stringify(JSON.parse(storage.getItem('examData'))),
                },
                dataType: 'JSONP',
                // data: JSON.stringify(JSON.parse(storage.getItem('examData'))),
                data: { examData: JSON.stringify(JSON.parse(storage.getItem('examData'))), },
                success: function(data) {
                    storage.removeItem('examData');
                    chooseType.value = '';
                    chooseYear.value = '';
                    chooseMonth.value = '';
                    chooseDay.value = '';
                    chooseSHour.value = '';
                    chooseSMin.value = '';
                    chooseEHour.value = '';
                    chooseEMin.value = '';
                    chooseLocation.value = '';
                    explicitLocation.value = '';
                    infoNotes.value = '';
                    addClass(pubAddBtn, 'disabled');
                    pubAddBtn.setAttribute('disabled', 'disabled');
                    addClass(pubCpltBtn, 'disabled');
                    pubCpltBtn.setAttribute('disabled', 'disabled');
                    window.location.reload();
                    alert('提交成功!');
                },
                error: function(err) {
                    console.log(err + 'buxiaode');
                    alert('提交失败!');
                }
            });
        }
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