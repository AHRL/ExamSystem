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

    EventUtil.addHandler(pubAddBtn, 'click', function() {
        console.log(storage.getItem('infoNote'));

        examNote.innerHTML = storage.getItem('infoNote');
    });
}