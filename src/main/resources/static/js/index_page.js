window.onload = function () {
    var h1Anim = document.getElementsByClassName('h1-anim'),
        h2Anim = document.getElementsByClassName('h2-anim');

    /* **********************************************************
    * Form validate
    *
    * */

    // Sign up validation ---------------------------------------

    // create Function addClass(), removeClass(), hasClass()
    // From http://www.cnblogs.com/mbyund/p/6908959.html
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
            }
            if (hasClass(this, 'validationStyle-successed')){
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
            }
            if (hasClass(this, 'validationStyle-successed')){
                removeClass(this, 'validationStyle-successed');
            }
        }
    };

    // validate student id
    /*var uStuId = document.getElementById('upStuId');
    uStuId.onblur = function (event) {
        var stuReg = /20\d{10}/;
        var val = uStuId.id;
        if (!stuReg.test(val)){
            console.log('学号验证失败');
        } else {
            console.log('学号验证成功');
        }
    };*/

    // validate password
    var aPswdStr = ['弱', '中', '强'];
    var uPswd = document.getElementById('upPassword');
    /*uPswd.onblur = function (event) {
        var val = uPswd.value;
        var psdReg = ;
        // 待解决：密码强度验证
        var idx = checkPswdStrength(val);
        uPswd.className = idx ? 'correct' : 'error';
        if(!psdReg.test(val)){
            console.log('密码不符合要求');
        } else {
            console.log('密码验证成功');
        }
    };*/
    var pswStrength = document.getElementsByClassName('pswStrength')[0];
    var aPswStrengthItems = pswStrength.getElementsByClassName('pswStrength-item');
    var pswStrengthInfo = pswStrength.getElementsByClassName('pswSrength-info');
    uPswd.onblur = function () {
        var val = this.value;
        var idx = checkPswdStrength(val);

        if (idx) {
            this.className = 'error';
            createValidateMsg('密码不符合要求');
        } else {
            this.className = 'correct';
            for (var i=0; i<idx-1; i++){
                aPswStrengthItems[i].className = '';
                if(val !== ''){
                    aPswStrengthItems[i].className = 'active';
                }
            }
            pswStrengthInfo.innerHTML = aPswdStr[idx-1];
        }
    };
    uPswd.onfocus = function () {
        if (this.val !== ''){

        } else {

        }
    };

    // create Function checkPswdStrength
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

    // create Function createValidateMsg
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

    // create Function insertAfter
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

    var ensurePswFlag = false; // 页面还没有错误提示

    // ensure password
    var uEPswd = document.getElementById('upEnsurePassword');
    uEPswd.onblur = function () {
        var val = uEPswd.value;
        var el = document.createElement('p');
        if (val !== uPswd.value) {
            console.log('两次输入密码不一致');
            el.setAttribute('class', 'errorMsg');
            el.innerHTML = '&bigotimes; 两次输入密码不一致！ 请重新输入！';
            if(!ensurePswFlag){
                insertAfter(el, this);
                ensurePswFlag = true; // 页面已有错误提示
            }
            uEPswd.style.borderColor = '#d9534f';
            // 清空表单项
        } else {
            console.log('密码一致');
            uEPswd.style.borderColor = '#5cb85c';
        }
    };
    /*uEPswd.onfocus = function (event) {
        if (ensurePswFlag){
            var er = uEPswd.getElementsByClassName('errorMsg')[0];
            uEPswd.removeChild(er);
        }
        console.log(er);
        if(er){
            uEPswd.removeChild(er);
        }
    };*/

    // Sign in validation ---------------------------------------




    /* **********************************************************
    * AutoType
    * */

    // AutoType
    var elements = document.getElementsByClassName('txt-rotate');
    for(var i=0; i<elements.length; i++){
        var toRotate = elements[i].getAttribute('data-rotate');
        var period = elements[i].getAttribute('date-period');
        if(toRotate) {
            new TxtRotate(elements[i],JSON.parse(toRotate),period);
        }
    }

    // INJECT CSS
    var css = document.createElement('style');
    css.type = 'text/p-css';
    css.innerHTML = '.txt-rotate > .wrap {border-right: .3rem solid #666}';
    document.body.appendChild(css);

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

