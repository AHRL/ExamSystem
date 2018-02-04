window.onload = function() {
    pageFinished();
}

function pageFinished() {
    // define localStorage
    var storage = null;
    checkStorage();

    // define an Object to store initRenderPage() response data
    var examData = null;

    // params of Form
    var examineeName = document.getElementById('examineeName');
    var examineeId = document.getElementById('examineeId');
    var examineeMajor = document.getElementById('examineeMajor');
    var examineeContact = document.getElementById('examineeContact');
    var examineeToken = document.getElementById('examineeToken');
    var readme = document.getElementById('readme');
    var subInfoBtn = document.getElementById('subInfo');

    var examInfoIpt = Array.prototype.slice.call(document.getElementsByClassName('examInfoIpt'));
    var examineeData = '';

    var beforeSubmitBlock = document.getElementById('beforeSubmit');
    var examineeForm = document.getElementById('examineeForm');
    var afterSubmitBlock = document.getElementById('afterSubmit');

    var initYear = 0,
        initMonth = 0,
        initDay = 0,
        initHour = 0,
        initMinute = 0;

    var timeBlock = Array.prototype.slice.call(document.getElementsByClassName('timeBlock')[0]);
    var hourBlock = timeBlock.getElementsByClassName('hourBlock')[0];
    var minuteBlock = timeBlock.getElementsByClassName('minuteBlock')[0];
    var secondBlock = timeBlock.getElementsByClassName('secondBlock')[0];

    initRenderPage();

    EventUtil.addHandler(examineeName, 'keyup', varifyName);
    EventUtil.addHandler(examineeId, 'keyup', varifyId);
    EventUtil.addHandler(examineeMajor, 'keyup', varifyMajor);
    EventUtil.addHandler(examineeContact, 'keyup', varifyContact);
    EventUtil.addHandler(examineeToken, 'keyup', varifyToken);
    EventUtil.addHandler(subInfoBtn, 'click', function(event) {
        event.preventDefault();
        submitInfo();
    });
}

function checkStorage() {
    if (!window.localStorage) {
        alert('您的浏览器不支持 localStorage! 建议您升级浏览器或者更换为 Chrome 浏览器。');
    } else {
        storage = window.localStorage;
    }
}

/* 
 * 根据 ajax 请求考试基本数据 data.basic 渲染页面
 * 
 */

function initRenderPage() {
    $.ajax({
        type: 'GET',
        url: '',
        dataType: 'json',
        success: function(data) {
            console.log(data); // 应该是一个 json 字符串
            storage.setItem('examData', examData); // 存入缓存的 examData 是字符串
            data = jsonStrToObj(data);
            examData = data; // 在全局使用的 examData 是对象

            if (data.basic.isInner) { // 渲染内部考试表单，默认渲染外部
                renderInnerForm();
            }
            var dateArr = data.basic.date.split('-'); // '2018-02-05'
            var sTimeArr = data.basic.startTime.split(':'); // '19:00'
            createTimeBlock(dateArr, sTimeArr);
        },
        error: function(err) {
            console.log('初始化失败：' + err);
        }
    });
}

function renderInnerForm() {
    addClass(examineeId.parentNode, 'hidden');
    addClass(examineeMajor.parentNode, 'hidden');
    addClass(examineeContact.parentNode, 'hidden');
}

function getExamineeInfo() {
    var examineeObj = {}
    examineeObj.sName = examineeName.value;
    examineeObj.token = examineeToken.value;
    if (examData.basic.isInner) {
        examineeObj.sId = examineeId.value;
        examineeObj.major = examineeMajor.value;
        examineeObj.contact = examineeContact.value;
    }
    return examineeObj;
}

function jsonObjToStr(obj) {
    return JSON.stringify(obj);
}

function jsonStrToObj(str) {
    return JSON.parse(str);
}

function varifyName() {
    // 不为空
    if (!examineeName.value) {
        alert('请填写姓名');
    }
}

function varifyId() {
    // 纯数字，8-16位
    var regx = /\d{8, 16}/;
    if (!regx.test(examineeId)) {
        alert('学号格式不正确');
    }
}

function varifyMajor() {
    // 不为空
    if (!examineeMajor.value) {
        alert('请填写专业');
    }
}

function varifyContact() {
    // 纯数字，5-10位
    var regx = /\d{5, 10}/;
    if (!regx.test(examineeContact.value)) {
        alert('QQ 号不符合要求');
    }
}

function varifyToken() {
    // 与 examData.basic.token 全等
    if (examineeToken.value !== examData.basic.token) {
        alert('考试密令不正确，注意大小写！请询问考官！')
    }
}

function submitInfo() {
    if (!isReadmeChecked()) {
        alert('考生你好，请勾选“我已阅读《考试须知》”');
        return;
    }
    examineeData = jsonObjToStr(getExamineeInfo()); // JSON 字符串

    storage.setItem('examineeData', examineeData);
    $.ajax({
        type: 'POST',
        url: '',
        dataType: 'json',
        data: {
            'examineeData': examineeData
        },
        success: function(data) {
            console.log(data);
            if (data) {
                renderInfoSubmitted();
            }
        },
        error: function(err) {
            console.log('提交失败：' + err);
        }
    });
}

function isReadmeChecked() {
    if (readme.value) {
        return true;
    }
    return false;
}

function renderInfoSubmitted() {
    clearForm();
    addClass(beforeSubmitBlock, 'hidden');
    addClass(examineeForm, 'hidden');
    removeClass(afterSubmitBlock, 'hidden');
}

function clearForm() {
    for (var i = 0; i < examInfoIpt.length; i++) {
        examInfoIpt[i].value = '';
    }
    if (readme.checked) {
        readme.checked = false;
    }
}

function createTimeBlock(dateArr, sTimeArr) {
    initYear = parseInt(dateArr[0]);
    initMonth = parseInt(dateArr[1]);
    initDay = parseInt(dateArr[2]);
    initHour = parseInt(sTimeArr[0]);
    initMinute = parseInt(sTimeArr[1]);

    var ms = new Date(initYear, initMonth, initDay, initHour, initMinute).getMilliseconds();
    var nowMs = new Date.getMilliseconds();
    var minus = (ms - nowMs) / 1000; // 秒
    if (minus < 0) {
        return;
    }
    var min = minus % 60;
    var sec = minus - min * 60;
    hourBlock.innerText = '00';
    setTimeout(function() {
        minus -= 1;
        min = minus % 60;
        sec = minus - min * 60;
        minuteBlock.innerText = min.toString();
        secondBlock.innerText = sec.toString();
    }, 1000);
}