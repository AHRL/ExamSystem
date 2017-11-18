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
            }
        });
        EventUtil.addHandler(pswd, 'focus', function(){
            clearInput.call(this);
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
        // return false;
    }
    return false;
}
function replaceClass(obj, newCls, targetCls){
    var aCls = getClass(obj);
    if (Array.isArray(aCls)){
        var len = aCls.length;
        for (var i=0; i<len; i++){
            if (aCls[i] = targetCls){
                aCls[i] = newCls;
            }
        }
    }
}

// create Function checkPswdStrength()
function checkPswdStrength(sValue){
    var mode;
    if (sValue){
        var len = sValue.length;
        var matchUpperCase = sValue.split('').every(function (item) {
                return (/[A-Z]/).test(item);
            }),
            matchLowerCase = sValue.split('').every(function(item){
                return (/[a-z]/).test(item);
            }),
            matchNum = sValue.split('').every(function (item) {
                return (/[0-9]/).test(item);
            }),
            matchLength = sValue.length;
        var singleMod = (matchUpperCase&&!matchLowerCase&&!matchNum) || (!matchUpperCase&&matchLowerCase&&!matchNum) || (!matchUpperCase&&!matchLowerCase&&matchNum);
        if ( matchLength<8 || matchLength>16 ){
            mode = 0;  // not match
        } else {
            if (len<=10){
                if (singleMod){
                    mode = 1;  // low
                } else {
                    mode = 2;  // middle
                }

            } else {
                if (singleMod){
                    mode = 2;  // middle
                } else {
                    mode = 3;  // high
                }
            }
        }
        switch (mode){
            case 0:
                return 0;
                break;
            case 1:
                return 1;
                break;
            case 2:
                return 2;
                break;
            case 3:
                return 3;
                break;
        }
    }
}

// create Function createPswdStrength()
// use Function insertAfter()
function createPswdStrength(preSiblingNode, mode) {
    if (mode) {
        var division = document.createElement('div');
        division.className = 'pswdStrength';
        var info = (function(){
            var span = document.createElement('span');
            span.className = 'pswdStrength-info';
            var aStrength = ['弱', '中', '强'];
            var strength = aStrength[mode-1];
            span.innerHTML = '&check; 密码强度：' + strength;
            return span;
        })();
        division.appendChild(info);
        for(var i=0; i<3; i++){
            (function (i, mode){
                var spanItems = [];
                spanItems[i] = document.createElement('span');
                addClass(spanItems[i], 'pswdStrength-item');
                if (i<mode){
                    addClass(spanItems[i], 'pswdStrength-item--active')
                }
                division.appendChild(spanItems[i]);
            })(i, mode);
        }
        insertAfter(division, preSiblingNode);
    }
}

// create Function createValidateMsg()
/*function createValidateMsg(obj, str, boo){
    var para = document.createElement('p');
    para.className = 'validationMsg';
    var b = boo || false;
    if(b){
        addClass(para, 'validationMsg-successed');
        para.innerHTML = '&check; ' + str;
    } else {
        addClass(para, 'validationMsg-failed');
        para.innerHTML = '&bigotimes; ' + str;
    }
    insertAfter(para, obj);
}*/
// create Function popTip() and pupTip()
function popTip(msg, classNames){
    var span = document.createElement('span');
    span.innerHTML = msg;
    this.nextElementSibling.appendChild(span);
    classNames = ' ' + classNames.split(' ') + ' ';
    addClass(this.nextElementSibling, classNames);
}
function pupTip(){
    removeClass('fade-in');
    addClass('fade-out');
}

// create Function insertAfter() and removeAfter()
// Based DOM Scripting - Web Design with JavaScript and the Document Object Model
function insertAfter(newElement, targetElement){
    var parent = targetElement.parentNode;
    if (parent.lastChild === targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}
function removeAfter(targetElement){
    var parent = targetElement.parentNode;
    parent.removeChild(targetElement.nextSibling);
}

// create Function clearForm()
// Based http://www.cnblogs.com/shanlin/archive/2014/07/17/3850417.html
function clearForm() {
    var aIpt = this.getElementsByTagName('input');
    var len = aIpt.length;
    if (len){
        for (var j=0; j<len; j++){
            (function (j) {
                removeAfter(aIpt[j]);
                if (hasClass(aIpt[j], 'validationStyle-successed')){
                    removeClass(aIpt[j], 'validationStyle-successed');
                } else {
                    removeClass(aIpt[j], 'validationStyle-failed');
                }
                aIpt[j].value = '';
            })(j);
        }
    }
}

function showTip(tip){
    this.lastElementChild.innerHTML = tip;
    this.style.display = 'block';
}

function clearInput(){
    if (this.nextElementSibling.style.display === 'block'){
        this.nextElementSibling.style.display = 'none';
    }
    if (hasClass(this, 'validationStyle-failed')){
        removeClass(this, 'validationStyle-failed');
    }
    if (hasClass(this, 'validationStyle-successed')){
        removeClass(this, 'validationStyle-successed');
    }
}




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