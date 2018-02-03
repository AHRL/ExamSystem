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
    var examineeData = null;

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
            console.log(data);
            console.log(data.basic.info);
            console.log(data.basic.isInner);
            console.log(data.basic.date);
            examData = data;

            if (data.basic.isInner) { // 渲染内部考试表单，默认渲染外部
                renderInnerForm();
            }

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
    examineeData.sName = examineeName.value;
    examineeData.token = examineeToken.value;
    if (examData.basic.isInner) {
        examineeData.sId = examineeId.value;
        examineeData.major = examineeMajor.value;
        examineeData.contact = examineeContact.value;
    }
}

function varifyName() {
    // 不为空
}

function varifyId() {
    // 纯数字，8-16位
}

function varifyMajor() {
    // 不为空
}

function varifyContact() {
    // 纯数字，5-10位
}

function varifyToken() {
    // 与 examData.basic.token 全等
}

function submitInfo() {
    if (!isReadmeChecked()) {
        alert('考生你好，请勾选“我已阅读《考试须知》”');
        return;
    }
    $.ajax({
        type: 'POST',
        url: '',
        dataType: 'json',
        data: {

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

}