(function () {
    var script = document.createElement('script');
    var __dirPath = '../static/js/';
    script.setAttribute('src', __dirPath + 'funLib.js');
    document.head.appendChild(script);
})();
(function (){

})();
window.onload = function () {

    /* **********************************************************
    * onload Animation
    *
    * */

    (function(){
        var oH1 = document.getElementsByTagName('h1')[0];
        var oH2 = document.getElementsByTagName('h2')[0];
        // var formBtns = document.getElementById('form-group-btns');
        // var oFooter = document.getElementById('footer');

        function startAnim(obj, callback, isDelayNext, delayTime){
            if (obj){
                if (!hasClass(obj, 'fadeInDown')){
                    addClass(obj, 'fadeInDown');
                }
            }
            if (callback && typeof callback === 'function'){
                if (isDelayNext){
                    setTimeout(callback, delayTime);
                } else {
                    callback();
                }
            }
        }

        startAnim(oH1, function () {
            startAnim(oH2);
        }, true, 200);

    })();

    /* **********************************************************
    * AutoType
    * */



    /* **********************************************************
    * Form validate
    *
    * */

    // Sign up validation ---------------------------------------
    /*(function(){
        // validate e-mail
        var uEml = document.getElementById('upEmail');
        EventUtil.addHandler(uEml, 'blur', function () {
            var emlReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            var val = this.value;
            var matchEmail;
            if (val){
                matchEmail = val.split(/\s*, \s*!/g).every(function (item) {
                    return emlReg.test(item);
                });
                if(matchEmail){
                    $.ajax({
                        type: 'get',
                        url: 'http://localhost:8080/isExist',
                        dataType: 'text',
                        data: {
                            "email": val
                        },
                        success: function (data, textStatus, jqXHR) {
                            if (parseInt(data)){
                                addClass(uEml, 'validationStyle-failed');
                                createValidateMsg(uEml, '该邮箱已被注册', false);
                            } else {
                                addClass(uEml, 'validationStyle-successed');
                                createValidateMsg(uEml, '邮箱验证成功', true);
                            }
                        },
                        error: function (jqXHR, textStatus, error) {
                            console.log('error' + textStatus);
                        }
                    })
                } else {
                    addClass(this, 'validationStyle-failed');
                    popTip().call(this, '邮箱格式不正确', ['alert-danger', 'fade-in']);
                    //createValidateMsg(this, '邮箱格式不正确', false);
                }
            } else {
                addClass(this, 'validationStyle-failed');
                //createValidateMsg(this, '邮箱为空', false);
            }
        });
        EventUtil.addHandler(uEml, 'focus', function () {
            /!*var valiMsg = this.getElementsByClassName('validateMsg');
            if (valiMsg) {
                removeAfter(this);
                if (hasClass(this, 'validationStyle-failed')){
                    removeClass(this, 'validationStyle-failed');
                } else {
                    removeClass(this, 'validationStyle-successed');
                }
            }*!/
            var flag = hasClass(this.nextElementSibling, 'fade-in');
            if (flag){
                pupTip().call(this);
            }
        });

        // validate username
        var uUsr = document.getElementById('upUsername');
        EventUtil.addHandler(uUsr, 'blur', function () {
            var val = this.value;
            var matchUsername;
            if (val){
                matchUsername = val.split('').every(function (item) {
                    return (/[\w]/).test(item);
                });
                if (matchUsername){
                    addClass(this, 'validationStyle-successed');
                    //createValidateMsg(this, '用户名验证成功', true);
                } else {
                    addClass(this, 'validationStyle-failed');
                    //createValidateMsg(this, '用户名验证失败', false);
                }
            } else {
                addClass(this, 'validationStyle-failed');
                //createValidateMsg(this, '用户名为空', false);
            }

        });
        EventUtil.addHandler(uUsr, 'focus', function () {
            var valiMsg = this.getElementsByClassName('validateMsg');
            if (valiMsg) {
                removeAfter(this);
                if (hasClass(this, 'validationStyle-failed')){
                    removeClass(this, 'validationStyle-failed');
                } else {
                    removeClass(this, 'validationStyle-successed');
                }
            }
        });

        // validate password
        var pswdFlag = false;
        var uPswd = document.getElementById('upPassword');
        EventUtil.addHandler(uPswd, 'blur', function () {
            var val = this.value;
            if (val){
                var idx = checkPswdStrength(val);
                if (idx) {
                    pswdFlag = true;
                    addClass(this, 'validationStyle-successed');
                    createPswdStrength(this, idx);
                } else {
                    addClass(this, 'validationStyle-failed');
                    //createValidateMsg(this, '密码长度应该为6-16位', false);
                }
            } else {
                addClass(this, 'validationStyle-failed');
                //createValidateMsg(this, '密码为空', false);
            }

        });
        EventUtil.addHandler(uPswd, 'focus', function () {
            /!*if (hasClass(this, 'validationStyle-failed')){
                removeClass(this, 'validationStyle-failed');
                removeAfter(this);
            }
            if (hasClass(this, 'validationStyle-successed')){
                removeClass(this, 'validationStyle-successed');
                removeClass(this.nextSibling.childNodes, 'pswdStrength-item');
                if (hasClass(this.nextSibling.childNodes, 'pswdStrength-item--active')){
                    removeClass(this.nextSibling.childNodes, 'pswdStrength-item');
                }
                removeAfter(this);
            }*!/
            var valiMsg = this.getElementsByClassName('validateMsg');
            if (valiMsg) {
                removeAfter(this);
                if (hasClass(this, 'validationStyle-failed')){
                    removeClass(this, 'validationStyle-failed');
                }
                if (hasClass(this, 'validationStyle-successed')){
                    removeClass(this, 'validationStyle-successed');
                }
            }
        });

        // ensure password
        var uEPswd = document.getElementById('upEnsurePassword');
        EventUtil.addHandler(uEPswd, 'blur', function () {
            var val = this.value;
            if (val) {
                if (pswdFlag){
                    if (val === uPswd.value) {
                        addClass(this, 'validationStyle-successed');
                        //createValidateMsg(this, '密码一致', true);
                    } else {
                        addClass(this, 'validationStyle-failed');
                        //createValidateMsg(this, '两次密码输入不一致', false);
                    }
                } else {
                    addClass(this, 'validationStyle-failed');
                    //createValidateMsg(this, '密码还未符合要求，请检查密码', false);
                }
            } else {
                addClass(this, 'validationStyle-failed');
                //createValidateMsg(this, '输入为空', false);
            }

        });
        EventUtil.addHandler(uEPswd, 'focus', function () {
            var valiMsg = this.getElementsByClassName('validateMsg');
            if (valiMsg) {
                removeAfter(this);
                if (hasClass(this, 'validationStyle-failed')){
                    removeClass(this, 'validationStyle-failed');
                }
                if (hasClass(this, 'validationStyle-successed')){
                    removeClass(this, 'validationStyle-successed');
                }
            }
        });

        // get validate message
        var getValMsgBtn = document.getElementById('getValMsgBtn');
        EventUtil.addHandler(getValMsgBtn, 'click', function () {
            // var nameVal = uUsr.value;
            var emailVal = uEml.value;
            /!*$.ajax({
                method: 'POST',
                url: 'http://localhost:8080/register',
                dataType: 'json',
                data: {
                    'name': nameVal,
                    'email': emailVal
                },
                success: function (response) {
                    console.log('验证码已发送');
                },
                error: function (status) {
                    console.log('error' + status);
                }
            })*!/
            $.ajax({
                type: 'POST',
                url: '/mailSender',
                dataType: 'json',
                data: {
                    'email': emailVal
                },
                success: function (data, textStatus, jqXHR) {
                    console.log('验证码已发送' + data);
                },
                error: function (jqXHR, textStatus, error) {
                    console.log('error' + textStatus);
                }
            });
        });

        // ensure validate message
        var uVMsg = document.getElementById('upValMsg');
        EventUtil.addHandler(uVMsg, 'blur', function () {
            var validcode;

            var codeReg = /\d/;
            var val = this.value;
            var matchCode;
            matchCode = val.split('').every(function (item) {
                return codeReg.test(item);
            });

            if (val.length===6 && matchCode){
                $.ajax({
                    method: 'get',
                    url: 'http://localhost:8080/validcode',
                    dataType: 'json',
                    success: function (response) {
                        validcode = JSON.stringify(response);
                        if (validcode === uVMsg.value){
                            addClass(this, 'validationStyle-successed');
                            //createValidateMsg(uVMsg.nextSibling, '验证成功', true);
                        } else {
                            addClass(this, 'validationStyle-failed');
                            //createValidateMsg(uVMsg.nextSibling, '验证失败', false);
                        }
                    },
                    error: function (status) {
                        console.log('error');
                    }
                })
            } else {
                addClass(this, 'validationStyle-failed');
                //createValidateMsg(this.nextSibling, '验证失败', false);
            }

        });
        EventUtil.addHandler(uVMsg, 'focus', function () {
            /!*var valiMsg = this.getElementsByClassName('validateMsg');
            if (valiMsg) {
                removeAfter(this.nextSibling);
                if (hasClass(this, 'validationStyle-failed')){
                    removeClass(this, 'validationStyle-failed');
                }
                if (hasClass(this, 'validationStyle-successed')){
                    removeClass(this, 'validationStyle-successed');
                }
            }*!/
        });

        // submit
        var signUpForm = document.getElementById('signUpForm');
        var upSubmitButton = document.getElementById('upSubmitButton');
        EventUtil.addHandler(upSubmitButton, 'click', function () {
            signUpForm.submit();
        });

        // close
        var oClose = document.getElementsByClassName('close')[1];
        EventUtil.addHandler(oClose, 'click',function () {
            var aIpt = signUpForm.getElementsByTagName('input');
            var len = aIpt.length;
            if (len){
                for (var j=0; j<len; j++){
                    (function (j) {
                        if (aIpt[j].nextSibling){
                            removeAfter(aIpt[j]);
                            if (hasClass(aIpt[j], 'validationStyle-successed')){
                                removeClass(aIpt[j], 'validationStyle-successed');
                            } else {
                                removeClass(aIpt[j], 'validationStyle-failed');
                            }
                            aIpt[j].value = '';
                        }
                    })(j);
                }
            }
        });
    })();*/
    (function () {
        // validate e-mail
        var uEml = document.getElementById('upEmail');
        EventUtil.addHandler(uEml, 'blur', function () {
            var emlReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            var val = this.value;
            var matchEmail;
            if (val){
                matchEmail = val.split(/\s*, \s*/g).every(function (item) {
                    return emlReg.test(item);
                });
                if(matchEmail){
                    $.ajax({
                        type: 'get',
                        url: 'http://localhost:8080/isExist',
                        dataType: 'text',
                        data: {
                            "email": val
                        },
                        success: function (data, textStatus, jqXHR) {
                            if (parseInt(data)){
                                addClass(uEml, 'validationStyle-failed');
                                showTip.call(uEml.nextElementSibling, '邮箱已被注册！');
                            } else {
                                addClass(uEml, 'validationStyle-successed');
                            }
                        },
                        error: function (jqXHR, textStatus, error) {
                            console.log('error' + textStatus);
                        }
                    });
                } else {
                    addClass(this, 'validationStyle-failed');
                    showTip.call(this.nextElementSibling, '邮箱格式不正确！');
                }
            } else {
                addClass(this, 'validationStyle-failed');
                showTip.call(this.nextElementSibling, '请填写邮箱！');
            }
        });
        EventUtil.addHandler(uEml, 'focus', function () {
            clearInput.call(this);
        });
        // validate username
        var uUsr = document.getElementById('upUsername');
        EventUtil.addHandler(uUsr, 'blur', function () {
            var val = this.value;
            var matchUsername;
            if (val){
                matchUsername = val.split('').every(function (item) {
                    return (/[\w]/).test(item);
                });
                if (matchUsername){
                    addClass(this, 'validationStyle-successed');
                } else {
                    addClass(this, 'validationStyle-failed');
                    showTip.call(this.nextElementSibling, '用户名不符合要求！');
                }
            } else {
                addClass(this, 'validationStyle-failed');
                showTip.call(this.nextElementSibling, '请填写用户名！');
            }

        });
        EventUtil.addHandler(uUsr, 'focus', function () {
            clearInput.call(this);
        });
        // validate password
        var pswdFlag = false;
        var uPswd = document.getElementById('upPassword');
        EventUtil.addHandler(uPswd, 'blur', function () {
            var val = this.value;
            if (val){
                var idx = checkPswdStrength(val);
                if (idx) {
                    pswdFlag = true;
                    addClass(this, 'validationStyle-successed');
                    //createPswdStrength(this, idx);
                } else {
                    addClass(this, 'validationStyle-failed');
                    showTip.call(this.nextElementSibling, '密码不符合要求！');
                }
            } else {
                addClass(this, 'validationStyle-failed');
                showTip.call(this.nextElementSibling, '请填写密码！');
            }

        });
        EventUtil.addHandler(uPswd, 'focus', function () {
            clearInput.call(this);
        });
        // password visiblity
        var uPsdVis = uPswd.nextElementSibling.nextElementSibling;
        EventUtil.addHandler(uPsdVis, 'mousedown', function () {
            removeClass(this, 'fa-eye-slash');
            addClass(this, 'fa-eye');
            uPswd.type = 'text';
        });
        EventUtil.addHandler(uPsdVis, 'mouseup', function () {
            removeClass(this, 'fa-eye');
            addClass(this, 'fa-eye-slash');
            uPswd.type = 'password';
        });
        // ensure password
        var uEPswd = document.getElementById('upEnsurePassword');
        EventUtil.addHandler(uEPswd, 'blur', function () {
            var val = this.value;
            if (val) {
                if (pswdFlag){
                    if (val === uPswd.value) {
                        addClass(this, 'validationStyle-successed');
                    } else {
                        addClass(this, 'validationStyle-failed');
                        showTip.call(this.nextElementSibling, '两次密码输入不一致！');
                    }
                } else {
                    addClass(this, 'validationStyle-failed');
                    showTip.call(this.nextElementSibling, '密码还未符合要求！无法确认！');
                }
            } else {
                addClass(this, 'validationStyle-failed');
                showTip.call(this.nextElementSibling, '请确认密码！');
            }

        });
        EventUtil.addHandler(uEPswd, 'focus', function () {
            clearInput.call(this);
        });
        // get validate message
        var getValMsgBtn = document.getElementById('getValMsgBtn');
        EventUtil.addHandler(getValMsgBtn, 'click', function () {
            var emailVal = uEml.value;
            function setTime(time) {
                if (time === 0){
                    clearTimeout(timer);
                    getValMsgBtn.removeAttribute('disabled');
                    removeClass(getValMsgBtn, 'disabled');
                    getValMsgBtn.innerHTML = '获取邮箱验证码';
                } else {
                    if (!getValMsgBtn.getAttribute('disabled')){
                        getValMsgBtn.setAttribute('disabled', 'disabled');
                    }
                    if (!hasClass(getValMsgBtn, 'disabled')){
                        addClass(getValMsgBtn, 'disabled');
                    }
                    getValMsgBtn.innerHTML = time + 's 后重新获取';
                    time--;
                    var timer = setTimeout(function () {
                        setTime(time);
                        console.log(time);
                    }, 1000);
                }
            }
            setTime(60);
            $.ajax({
                type: 'POST',
                url: '/mailSender',
                dataType: 'json',
                data: {
                    'email': emailVal
                },
                success: function (data, textStatus, jqXHR) {
                    console.log('验证码已发送' + data);
                },
                error: function (jqXHR, textStatus, error) {
                    console.log('error' + textStatus);
                }
            });
        });
        // ensure validate message
        var uVMsg = document.getElementById('upValMsg');
        EventUtil.addHandler(uVMsg, 'blur', function () {
            var validcode;
            var codeReg = /\d/;
            var val = this.value;
            var matchCode;
            matchCode = val.split('').every(function (item) {
                return codeReg.test(item);
            });

            if (val.length===6 && matchCode){
                $.ajax({
                    method: 'get',
                    url: 'http://localhost:8080/validcode',
                    dataType: 'json',
                    success: function (response) {
                        validcode = JSON.stringify(response);
                        if (validcode === uVMsg.value){
                            addClass(this, 'validationStyle-successed');
                        } else {
                            addClass(this, 'validationStyle-failed');
                            showTip.call(uVMsg.nextElementSibling, '验证码不正确！');
                        }
                    },
                    error: function (status) {
                        console.log('error');
                    }
                })
            } else {
                addClass(this, 'validationStyle-failed');
                showTip.call(uVMsg.nextElementSibling, '验证码不正确！');
            }

        });
        EventUtil.addHandler(uVMsg, 'focus', function () {
            clearInput.call(this);
        });
        // submit
        var signUpForm = document.getElementById('signUpForm');
        var upSubmitButton = document.getElementById('upSubmitButton');
        EventUtil.addHandler(upSubmitButton, 'click', function () {
            signUpForm.submit();
        });

        // close
        var oClose = document.getElementsByClassName('close')[1];
        EventUtil.addHandler(oClose, 'click',function () {
            var aIpt = signUpForm.getElementsByTagName('input');
            var len = aIpt.length;
            if (len){
                for (var j=0; j<len; j++){
                    (function (j) {
                        if (aIpt[j].value){
                            aIpt[j].value = '';
                        }
                        if (aIpt[j].nextElementSibling){
                            if (aIpt[j].nextElementSibling.style.display === 'block'){
                                aIpt[j].nextElementSibling.style.display = 'none';
                            }
                            if (hasClass(aIpt[j], 'validationStyle-failed')){
                                removeClass(aIpt[j], 'validationStyle-failed');
                            }
                            if (hasClass(aIpt[j], 'validationStyle-successed')){
                                removeClass(aIpt[j], 'validationStyle-successed');
                            }
                        }
                    })(j);
                }
            }
        });
    })();

    // Sign in validation ---------------------------------------
    (function(){
        // validate username
        var usr = document.getElementById('username');
        EventUtil.addHandler(usr, 'blur', function(){

        });
        EventUtil.addHandler(usr, 'focus', function(){
            clearInput.call(this);
        });

        // validate password
        var pswd = document.getElementById('password');
        EventUtil.addHandler(pswd, 'blur', function(){
            if (this.value >=8 && this.value<=16){
                addClass(this, 'validationStyle-successed');
            } else {
                addClass(this, 'validationStyle-failed');
                showTip.call(this.nextElementSibling, '密码不符合要求！')
            }
        });
        EventUtil.addHandler(pswd, 'focus', function(){
            clearInput.call(this);
        });

        // password visibility
        var psdVis = pswd.nextElementSibling.nextElementSibling;
        EventUtil.addHandler(psdVis, 'mousedown', function () {
            removeClass(this, 'fa-eye-slash');
            addClass(this, 'fa-eye');
            pswd.type = 'text';
        });
        EventUtil.addHandler(psdVis, 'mouseup', function () {
            removeClass(this, 'fa-eye');
            addClass(this, 'fa-eye-slash');
            pswd.type = 'password';
        });

        // submit
        var signInForm = document.getElementById('signInForm');
        var inSubmitButton = document.getElementById('inSubmitButton');
        EventUtil.addHandler(inSubmitButton, 'click', function () {
            this.setAttribute('disabled', 'disabled');
            addClass(this, 'disabled');
            $.ajax({
                type: "POST",
                url: "",
                data: {
                    "username": usr.value,
                    "password": pswd.value
                },
                success: function (data, textStatus, jqXHR) {
                    if (parseInt(data)){

                    } else {

                    }
                },
                error: function (jqXHR, textStatus, error) {

                }
            });
        });

        // close
        var oClose = document.getElementsByClassName('close')[0];
        EventUtil.addHandler(oClose, 'click', function () {
            var aIpt = signInForm.getElementsByTagName('input');
            var len = aIpt.length;
            if (len){
                for (var j=0; j<len; j++){
                    (function (j) {
                        if (aIpt[j].nextSibling){
                            removeAfter(aIpt[j]);
                            if (hasClass(aIpt[j], 'validationStyle-successed')){
                                removeClass(aIpt[j], 'validationStyle-successed');
                            } else {
                                removeClass(aIpt[j], 'validationStyle-failed');
                            }
                            aIpt[j].value = '';
                        }
                    })(j);
                }
            }
        });
    })();

};


// autoType.js
var TxtRotate = function(el, toRotate, period){
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtRotate.prototype.tick = function () {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if(this.isDeleting){
        this.txt = fullTxt.substring(0, this.txt.length-1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length+1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    var that = this;
    var delta = 300 - Math.random() * 100;

    if(this.isDeleting){ delta /= 2; }

    if(!this.isDeleting && this.txt === fullTxt){
        delta = this.period;
        /*this.isDeleting = true;*/ // 禁止回删文字
    } else if(this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function () {
        that.tick();
    }, delta);
};

/*function autoPlay(){
 // AutoType
 var elements = document.getElementsByClassName('txt-rotate');
 for(var i=0; i<elements.length; i++){
 var toRotate = elements[i].getAttribute('data-rotate');
 var period = elements[i].getAttribute('date-period');
 if(toRotate) {
 new TxtRotate(elements[i],JSON.parse(toRotate),period);
 }
 }

 // inject CSS
 var css = document.createElement('style');
 css.type = 'text/p-css';
 css.innerHTML = '.txt-rotate > .wrap {border-right: .3rem solid #666}';
 document.body.appendChild(css);
 }*/

/*startAnim(oH1, function () {
 startAnim(oH2, function () {
 autoPlay();
 }, true, 1000);
 }, true, 200);*/