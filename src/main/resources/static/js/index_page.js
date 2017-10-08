window.onload = function () {
    var h1Anim = document.getElementsByClassName('h1-anim'),
        h2Anim = document.getElementsByClassName('h2-anim');

    /* **********************************************************
    * Form validate
    *
    * */

    // Sign up validation

    var uEml = document.getElementById('upEmail');
    uEml.onblur = function (event) {
        var emlReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        var val = uEml.value.split(/\s*, \s*/g);
        for(var i=0, len=val.length; i<len; i++){
            if(!emlReg.test(val[i])){
                console.log('邮箱验证失败');
            } else {
                console.log('邮箱验证成功');
            }
        }
    };

    var uUsr = document.getElementById('upUsername');
    uUsr.onblur = function (event) {
        var usrReg = /\w/;
        var val = uUsr.value;
        if (!usrReg.test(val)){
            console.log('用户名验证失败');
        } else {
            console.log('用户名验证成功');
        }
    };

    var uPswd = document.getElementById('upPassword');
    uPswd.onblur = function (event) {
        var val = uPswd.value;
        var psdReg = /^[\w.]{8,16}$/;
        // 待解决：密码强度验证
        var lowReg = /[0-9]{8,16}|[a-z]{8,16}|[A-Z]{8,16}|\.{8,16}/;
        if(!psdReg.test(val)){
            console.log('密码不符合要求');
        } else {
            console.log('密码验证成功');
            if(lowReg.test(val)){
                console.log('密码强度低');
            }
        }
    };

    // create Function insertAfter

    function insertAfter(newElement, targetElement){
        var parent = targetElement.parentNode;
        if (parent.lastChild === targetElement) {
            parent.appendChild(newElement);
        } else {
            parent.insertBefore(newElement, targetElement.nextSibling);
        }
    }

    var ensurePswFlag = false; // 页面还没有错误提示

    var uEPswd = document.getElementById('upEnsurePassword');
    uEPswd.onblur = function (event) {
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
    uEPswd.onfocus = function (event) {
        if (ensurePswFlag){
            var er = uEPswd.getElementsByClassName('errorMsg')[0];
            uEPswd.removeChild(er);
        }
        console.log(er);
        if(er){
            uEPswd.removeChild(er);
        }
    };

    // Sign in validation




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

