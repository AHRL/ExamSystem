class Login {
    constructor() {
        this.regx = {
            email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
            pswd: /^[a-zA-Z0-9!@#$%^&*]{6,16}$/,
        };
        this.$formIn = $('formIn');
        this.$emailIn = $('emailIn');
        this.$pswdIn = $('pswdIn');
        this.$submitIn = $('#submitIn');
        this.$logIn = $('#loginIn');

        this.$formUp = $('formUp');
        this.$emailUp = $('#emailUp'),
        this.$nameUp = $('#nameUp'),
        this.$pswdUp = $('#pswdUp'),
        this.$enPswdUp = $('#enPwsdUp'),
        this.$valCode = $('#valCode'),
        this.$getValCodeBtn = $('#sendValCode'),
        this.$submitUp = $('#submitUp');
        this.$logUp = $('#logUp');

        this.flag = {
            email: false,
            name: false,
            pswd: false,
            enPswd: false,
            valCode: false
        }
    }

    init() {
        this.submitIn();
        this.checkEmailUp();
        this.checkNameUp();
        this.checkPswdUp();
        this.checkEnPswdUp();
        this.getValCode();
        this.submitUp();
    }

    checkEmailIn() {
        this.$emailIn.on('blur', e => {
            const val = this.$emailIn.val();
            let result;
            if (val) {
                result = this.check('email', val);
                if (result) {
                    $.get('/api/isEmailExist')
                    .then(data => {
                        data = JSON.parse(data);
                        const res = data.data;
                        if (data.ret && res) {
                            if (res.isExist === false) {
                                this.fadeIn('该用户未被注册');
                                this.flag.email = false;
                            }
                        } else {
                            this.flag.email = true;
                        }
                    })
                    .fail(err => {
                        console.error(err);
                    });
                } else {
                    this.fadeIn('用户名不正确');
                    this.flag.email = false;
                }     
            }
        })
    }

    checkPswdIn() {
        this.$pswdIn.on('blur', e => {
            const val = this.$pswdIn.val();
            let result;
            if (val) {
                result = this.check('pswd', val);
                if (!result) {
                    this.fadeIn('密码不符合要求');
                    this.flag.pswd = false;
                } else {
                    this.flag.pswd = true;
                }
            }
        });
    }

    submitIn() {
        this.$submitIn.on('click', e => {
            this.$formIn.submit();
        });
    }

    checkEmailUp() {
        this.$emailUp.on('blur', e => {
            const val = this.$emailUp.val();
            let result;
            if (val) {
                result = this.check('email', val);
                if (result) {
                    $.get('/api/isEmailExsit', `email=${val}`)
                    .then(data => {
                        data = JSON.parse(data);
                        const res = data.data;
                        if (data.ret && res) {
                            if (res.isExsit !== true) {
                                this.fadeUp('邮箱已被注册');
                                this.flag.email = false;
                            }
                        } else {
                            this.flag.email = true;
                        }
                    })
                    .fail(err => {
                        console.error(err);
                    });
                } else {
                    this.fadeUp('邮箱格式不正确');
                    this.flag.email = false;
                }     
            }     
        });
    }

    checkNameUp() {
       this.$nameUp.on('blur', e => {
           const val = this.$nameUp.val();
           let result;
           if (val) {
                result = this.check('name', val);
                if (result) {
                    $.get('/api/isUsernameExsit', `username=${username}`)
                    .then(data => {
                        data = JSON.parse(data)
                        const res = data.data
                        if (data.ret && res) {
                            if (res.isExsit !== true) {
                                this.fadeUp('用户名已被注册');
                                this.flag.name = false;
                            } else {
                                this.flag.name = true
                            }
                        }
                    })
                    .fail(err => {
                        console.error(err)
                    })
                    
                } else {
                    this.fadeUp('姓名不符合要求')
                    this.flag.name = false
                }
           }
       });
    }

    checkPswdUp() {
        this.$pswdUp.on('blur', e => {
            const val = this.$pswdUp.val();
            let result;
            if (val) {
                result = this.check('pswd', val);
                if (!result) {
                    this.fadeUp('密码不符合要求');
                    this.flag.pswd = false;
                } else {
                    this.flag.pswd = true;
                }
            }
        });
    }

    checkEnPswdUp() {
        this.$enPswdUp.on('blur', e => {
            const val = this.$enPswdUp.val();
            if (this.$pswdUp.val() !== val) {
                this.fadeUp('两次密码不一致');
                this.flag.enPswd = false;
            } else {
                this.flag.enPswd = true;
            }
        })
    }
    
    getValCode() {
        this.$getValCodeBtn.on('click', e => {
            e.preventDefault();
            $.get('/api/getValCode')
                .then(data => {
                    data = JSON.parse(data);
                    const res = data.data;
                    if (data.ret && res) {
                        this.$valCode.on('blur', e => {
                            const val = this.$valCode.val();
                            if (val !== res.valCode) {
                                this.fadeUp('验证码不正确');
                                this.flag.valCode = false;
                            } else {
                                this.flag.valCode = true;
                            }
                        });
                        this.dealEmailCountingDown(this.$getValCodeBtn, function(context) {
                            context.addClass('disabled').attr('disabled', 'true');
                        }, function(context) {
                            context.removeClass('disabled').removeAttr('disabled');
                        });
                    }
                })
                .fail(err => {
                    this.flag.valCode = false;
                });
        });
    }
    
    submitUp() {
        this.$submitUp.on('click', e => {
            if (this.flag.email && this.flag.name && this.flag.pswd && this.flag.enPswd && this.flag.valCode) {
                console.log(1);
                this.$formUp.submit();
            } else {
                console.log(0);
            }
        });
    }

    dealEmailCountingDown(jqObj, beginCB, endCB) {
        jqObj = (jqObj instanceof $) ? jqObj : $(jqObj);
        if (beginCB && beginCB instanceof Function) {
            beginCB(jqObj);
        }
        this.countingDown(jqObj, 60, endCB)();
    }

    countingDown(obj, count, callback) {
        const self = this;
        return function() {
            count -= 1;
            $(obj).text(count + '秒后重新获取验证码');
            var timer = null;
            if (count !== 0) {
                timer = setTimeout(self.countingDown($(obj), count, callback), 1000);
            } else {
                clearTimeout(timer);
                $(obj).text('获取邮箱验证码');
                if (callback && callback instanceof Function) {
                    callback(obj);
                }
            }
        }
    }

    fadeIn(content) {
        this.$logIn.text(content).fadeIn('fast').fadeOut(2000);
    }

    fadeUp(content) {
        this.$logUp.text(content).fadeIn('fast').fadeOut(2000);
    }

    check(type, value) {
        let result = '';
        switch (type) {
            case 'email':
                result = value.split(/\s*, \s*/g).every((item) => {
                    return this.regx.email.test(item);
                });
                break;
            case 'name':
                result = !!value.length;
                break;
            case 'pswd':
                result = value.length >= 6 && value.length <= 16 ? true : false;
                break;
            default:
                break;
        }
        console.log(result);
        return result;
    }
}

$(document).ready(function() {
    const login = new Login();
    login.init();
});