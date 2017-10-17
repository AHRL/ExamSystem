window.onload = function () {


    /* **********************************************************
    * onload Animation
    *
    * */

    (function(){
        var oH1 = document.getElementsByTagName('h1')[0];
        var oH2 = document.getElementsByTagName('h2')[0];

        function startAnim(obj, callback){
            if (!hasClass(obj, 'fadeInDown')){
                addClass(obj, 'fadeInDown');
            }
            if (callback && typeof callback === 'function'){
                callback();
            }
        }
        startAnim(oH1, function(){
            startAnim(oH2);
        });
    })();

    /* **********************************************************
    * Form validate
    *
    * */

    // Sign up validation ---------------------------------------
    (function(){
        // validate e-mail
        var uEml = document.getElementById('upEmail');
        uEml.onblur = function () {
            var emlReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            var val = this.value;
            var matchEmail;
            if (val){
                matchEmail = val.split(/\s*, \s*/g).every(function (item) {
                    return emlReg.test(item);
                });
                if(matchEmail){
                    addClass(this, 'validationStyle-successed');
                    createValidateMsg(this, '邮箱验证成功', true);
                } else {
                    addClass(this, 'validationStyle-failed');
                    createValidateMsg(this, '邮箱验证失败', false);
                }
            } else {
                addClass(this, 'validationStyle-failed');
                createValidateMsg(this, '邮箱为空', false);
            }
        };
        uEml.onfocus = function () {
            var valiMsg = this.getElementsByClassName('validateMsg');
            if (valiMsg) {
                removeAfter(this);
                if (hasClass(this, 'validationStyle-failed')){
                    removeClass(this, 'validationStyle-failed');
                } else {
                    removeClass(this, 'validationStyle-successed');
                }
            }
        };

        // validate username
        var uUsr = document.getElementById('upUsername');
        uUsr.onblur = function () {
            var val = this.value;
            var matchUsername;
            if (val){
                matchUsername = val.split('').every(function (item) {
                    return (/[\w]/).test(item);
                });
                if (matchUsername){
                    addClass(this, 'validationStyle-successed');
                    createValidateMsg(this, '用户名验证成功', true);
                } else {
                    addClass(this, 'validationStyle-failed');
                    createValidateMsg(this, '用户名验证失败', false);
                }
            } else {
                addClass(this, 'validationStyle-failed');
                createValidateMsg(this, '用户名为空', false);
            }

        };
        uUsr.onfocus = function () {
            var valiMsg = this.getElementsByClassName('validateMsg');
            if (valiMsg) {
                removeAfter(this);
                if (hasClass(this, 'validationStyle-failed')){
                    removeClass(this, 'validationStyle-failed');
                } else {
                    removeClass(this, 'validationStyle-successed');
                }
            }
        };

        // validate password
        var pswdFlag = false;
        var uPswd = document.getElementById('upPassword');
        uPswd.onblur = function () {
            var val = this.value;
            if (val){
                var idx = checkPswdStrength(val);
                if (idx) {
                    pswdFlag = true;
                    addClass(this, 'validationStyle-successed');
                    createPswdStrength(this, idx);
                } else {
                    addClass(this, 'validationStyle-failed');
                    createValidateMsg(this, '密码长度应该为6-16位', false);
                }
            } else {
                addClass(this, 'validationStyle-failed');
                createValidateMsg(this, '密码为空', false);
            }

        };
        uPswd.onfocus = function () {
            /*if (hasClass(this, 'validationStyle-failed')){
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
            }*/
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
        };

        // ensure password
        var uEPswd = document.getElementById('upEnsurePassword');
        uEPswd.onblur = function () {
            var val = this.value;
            if (val) {
                if (pswdFlag){
                    if (val === uPswd.value) {
                        addClass(this, 'validationStyle-successed');
                        createValidateMsg(this, '密码一致', true);
                    } else {
                        addClass(this, 'validationStyle-failed');
                        createValidateMsg(this, '两次密码输入不一致', false);
                    }
                } else {
                    addClass(this, 'validationStyle-failed');
                    createValidateMsg(this, '密码还未符合要求，请检查密码', false);
                }
            } else {
                addClass(this, 'validationStyle-failed');
                createValidateMsg(this, '输入为空', false);
            }

        };
        uEPswd.onfocus = function () {
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
        };

        // var aDismiss = document.getElementsByClassName('js-upDismiss');
        var oResetBtn = document.getElementById('upDismiss');
        oResetBtn.onclick = clearForm('signUpForm');
    })();

    // Sign in validation ---------------------------------------
    (function(){
        // validate username
        var usr = document.getElementById('username');
        usr.onblur = function(){

        };
        usr.onfocus = function(){

        };

        // validate password
        var pswd = document.getElementById('password');
        pswd.onblur = function(){

        };
        pswd.onfocus = function () {

        }
    })();


    /* **********************************************************
    * AutoType
    * */

    (function(){
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
        if ( matchLength<6 || matchLength>16 ){
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
function createValidateMsg(obj, str, boo){
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
function clearForm(id){
    var oId = document.getElementById(id);
        /*for (var i=0, len=oId.elements.length; i<len; i++){
            if (oId.elements[i].type === 'text'){
                oId.elements[i].value = '';
            } else if (oId.elements[i].type === 'password'){
                oId.elements[i].value = '';
            } else if (oId.elements[i].type === 'email'){
                oId.elements[i].value = '';
            }
        }*/
        /*for (var j=0; j<len; j++) {
            if (oId.elements[i])

        }*/
    oId.reset();
}

