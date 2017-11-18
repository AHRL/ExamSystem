(function(){
    var script = document.createElement('script');
    var __dirPath = '../static/js/';
    script.setAttribute('src', __dirPath + 'funLib.js');
    document.head.appendChild(script);
})();
window.onload = function () {
    (function(){
        var ul = document.getElementsByClassName('list-group')[0];
        var lists = ul.getElementsByClassName('list-group-item');
        var len = lists.length;
        var aMail = ['@163.com', '@126.com', '@qq.com', '@139.com', '@gmail.com'];
        var email = document.getElementById('email');
        EventUtil.addHandler(email, 'keyup', function () {
            var val = email.value;
            var vLen = val.length;
            if (vLen){
                ul.style.display = 'block';
                for (var i=0; i<len; i++){
                    lists[i].innerHTML = val + aMail[i];
                }
            } else {
                ul.style.display = 'none';
            }
        });
        EventUtil.addHandler(email, 'focus', function () {
            var val = email.value;
            if (val){
                var idx = val.indexOf('@');
                if (idx !== -1){
                    email.value = val.slice(0, idx);
                }
                ul.style.display = 'block';
                for (var i=0; i<len; i++){
                    lists[i].innerHTML = email.value + aMail[i];
                }
            }
        });
        EventUtil.addHandler(email, 'blur', function () {
            ul.style.display = 'none';
        });
        for (var j=0; j<len; j++){
            (function(j){
                EventUtil.addHandler(lists[j], 'mouseover', function(){
                    if (!hasClass(lists[j], 'list-group-item-action')){
                        addClass(lists[j], 'list-group-item-action');
                    }
                    email.value = lists[j].innerHTML;
                });
                EventUtil.addHandler(lists[j], 'click', function(){
                    email.value = lists[j].innerHTML;
                    ul.style.display = 'none';
                });
            }(j));
        }

        var btn = email.nextElementSibling.nextElementSibling;
        EventUtil.addHandler(btn, 'click', function () {
            var val = email.value;
            var emlReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            var matchEmail = val.split(/\s*, \s*/g).every(function (t) {
                return emlReg.test(t);
            });
            console.log(matchEmail);
            if (matchEmail){
                $.ajax({
                    type: 'POST',
                    url: '',
                    data: {
                        "email": val
                    },
                    success: function () {
                        
                    },
                    error: function () {
                        
                    }
                });
            } else {
                showTip.call(email.nextElementSibling, '邮箱格式不正确！');
            }
        });
    })();
};
