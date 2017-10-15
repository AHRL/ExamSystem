window.onload = function () {


    /* **********************************************************
    * Start Animation
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
            var val = uEml.value.split(/\s*, \s*/g);
            for(var i=0, len=val.length; i<len; i++){
                if(!emlReg.test(val[i])){
                    addClass(this, 'validationStyle-failed');
                    createValidateMsg(this, '邮箱验证失败', false);
                } else {
                    addClass(this, 'validationStyle-successed');
                    createValidateMsg(this, '邮箱验证成功', true);
                }
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
            var usrReg = /\w/;
            var val = uUsr.value;
            if (!usrReg.test(val)){
                addClass(this, 'validationStyle-failed');
                createValidateMsg(this, '用户名验证失败', false);
            } else {
                addClass(this, 'validationStyle-successed');
                createValidateMsg(this, '用户名验证成功', true);
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
        var uPswd = document.getElementById('upPassword');
        uPswd.onblur = function () {
            var val = this.value;
            var idx = checkPswdStrength(val);

            if (!idx) {
                addClass(this, 'validationStyle-failed');
                createValidateMsg(this, '密码不符合要求', false);
            } else {
                addClass(this, 'validationStyle-successed');
                createPswdStrength(uPswd, 2);
            }
        };
        uPswd.onfocus = function () {
            if (hasClass(this, 'validationStyle-failed')){
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
            }
        };

        // ensure password
        var uEPswd = document.getElementById('upEnsurePassword');
        uEPswd.onblur = function () {
            var val = uEPswd.value;
            if (val !== uPswd.value) {
                addClass(this, 'validationStyle-failed');
                createValidateMsg(this, '两次密码输入不一致', false);
            } else {
                addClass(this, 'validationStyle-successed');
                createValidateMsg(this, '密码一致', true);
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

// create Function addClass(), removeClass(), hasClass()
// Based http://www.cnblogs.com/mbyund/p/6908959.html
function addClass(obj, newCls) {
    var obj_classes = obj.className,
        blank = (obj.className !== '') ? ' ' : '';
    obj.className = obj_classes + blank + newCls;
}
function removeClass(obj, targetCls) {
    var obj_classes = ' ' + obj.className + ' ';
    obj.className = obj_classes.replace(/\s+/gi, ' ').replace(' ' + targetCls + ' ', ' ').replace(/^\s+|\s+$/g, '');
}
function hasClass(obj, targetCls) {
    var obj_classes = obj.className,
        obj_classes_arr = obj_classes.split(/\s+/);
    var len = obj_classes_arr.length;
    if (!len){
        for(var i=0; i<len; i++){
            if (obj_classes_arr[i] === targetCls){
                return true;
            }
        }
    }
    return false;
}

// create Function checkPswdStrength()
function checkPswdStrength(sValue){
    var mode;
    if (/^[\w.]{1,5}$/.test(sValue)){
        // fail to pass
        mode = 0;
    }
    if (/^[\w.]{6,8}$/.test(sValue)){
        // weak strength
        mode = 1;
    }
    if (/^[\w.]{9,12}$/){
        // normal strength
        mode = 2;
    }
    if (/^[\w.]{12,16}$/){
        // strong strength
        mode = 3;
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
            span.innerHTML = '密码强度：' + strength;
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

