$(document).ready(pageReady);

// DOM 无关的全局变量

// RegExp
var REG = {
    email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    pswd: /^[a-zA-Z0-9!@#$%^&*]{6,16}$/,
};

var server = '';

function pageReady() {
    // Page Login ------------------------
    // Sign in
    var $emailIn = $('#emailIn'),
        $pswdIn = $('#pswdIn'),
        $submitIn = $('#submitIn');

    var $formIn = $('#formIn');

    $emailIn.on('blur', checkValue(matchEmail));
    $emailIn.on('focus', rmValidationClass);
    $pswdIn.on('blur', checkValue(matchLength));
    $pswdIn.on('focus', rmValidationClass);
    $submitIn.on('click', function(e) {
        e.preventDefault();
        // /* $.ajax({
        //     type: 'POST',
        //     url: server + '/login',
        //     data: JSON.stringify({
        //         email: $emailIn.val(),
        //         pswd: $pswdIn.val()
        //     }),
        //     // dataType: '', // 我期望得到的数据类型
        //     contentType: 'application/json', // 我准备以该数据类型发送数据
        //     success: function(data) {
        //         console.log(data);
        //     },
        //     error: function(err) {
        //         console.error(err);
        //     }
        // }); */
    });

    // $formIn.on('submit', function(e) {
    //     e.preventDefault();
    //     $.ajax({
    //         type: 'POST',
    //         url: '/login',
    //         contentType: 'application/x-www-form-urlencoded',
    //         data: $formIn.serialize(),
    //         success: function(data) {
    //             console.log(data);
    //         },
    //         error: function(err) {
    //             console.error(err);
    //         }
    //     })
    // });

    // Sign up
    var $emailUp = $('#emailUp'),
        $nameUp = $('#nameUp'),
        $pswdUp = $('#pswdUp'),
        $enPswdUp = $('#enPwsdUp'),
        $valCode = $('#valCode'),
        $getValCodeBtn = $('#sendValCode'),
        $submitUp = $('#submitUp');

    $emailUp.on('blur', function() {
        var email = $emailUp.val();
        $.ajax({
            type: 'POST',
            url: server + '/v2/user?email=' + email,
            data: JSON.stringify({
                email: email
            }),
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {
                console.log(data);
            },
            error: function(err) {
                console.error(err);
            }
        })
    });
    $emailUp.on('focus', rmValidationClass);
    $nameUp.on('blur', checkValue(isNotEmptyForm))
    $nameUp.on('focus', rmValidationClass);
    $pswdUp.on('blur', checkValue(matchPswd));

    $getValCodeBtn.on('click', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'GET',
            url: server + '/api/getValCode',
            dataType: 'json',
            success: function(data) {
                console.log(data);
                data = JSON.parse(data).valCode;
                $valCode.on('blur', function() {
                    var val = $valCode.val();
                    if (data === val) {
                        $(this).addClass('is-valid');
                    } else {
                        $(this).addClass('is-invalid');
                    }
                });
                dealEmailCountingDown($getValCodeBtn, function(obj) {
                    obj.addClass('disabled').attr('disabled', 'true');
                }, function(obj) {
                    obj.removeClass('disabled').removeAttr('disabled');
                });
                $valCode.on('focus', function() {
                    if ($valCode.hasClass('.is-valid')) {
                        $valCode.removeClass('.is-valid');
                    }
                    if ($valCode.hasClass('is-invalid')) {
                        $valCode.removeClass('.is-invalid');
                    }
                });
            },
            error: function(err) {
                console.error(err);
            }
        })
    });
    $submitUp.on('click', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: server + '/api/signup',
            data: JSON.stringify({
                email: $emailUp.val(),
                name: $nameUp.val(),
                pswd: $pswdUp.val()
            }),
            dataType: 'json', // 我期望得到的数据类型
            contentType: 'application/json', // 我准备以该数据类型发送数据
            success: function(data) {
                console.log(data);
            },
            error: function(err) {
                console.error(err);
            }
        });
    });
}

/**
 * Func rmValidationClass
 * 
 * Remove validation class
 * 
 */
function rmValidationClass() {
    if ($(this).hasClass('.is-valid')) {
        $(this).removeClass('.is-valid');
    }
    if ($(this).hasClass('is-invalid')) {
        $(this).removeClass('.is-invalid');
        $(this.nextElementSibling).css({
            "display": "none"
        });
    }
}

/**
 * Func addValidationClass
 * 
 * Add validation class
 * 
 * @param {Boolean} flag 
 */
function addValidationClass(flag) {

}

/**
 * Func checkValue
 * 
 * @param {Function} matchFunc 
 * @returns {Function}
 */
function checkValue(matchFunc) {
    return function() {
        var val = $(this).val();
        var isMatch = matchFunc(val);
        if (isMatch) {
            $(this).addClass('is-valid');
        } else {
            $(this).addClass('is-invalid');
        }
    }
}

/**
 * Func matchEmail
 * 
 * Match e-mail
 * 
 * @param {String} value 
 * @returns {Boolean}
 */
function matchEmail(value) {
    return value.split(/\s*, \s*/g).every(function(item) {
        return REG.email.test(item);
    });
}

/**
 * Func matchLength
 * 
 * @param {String} value 
 * @param {Int} minLen 
 * @param {Int} maxLen 
 * @returns {Boolean}
 */
function matchLength(value, minLen, maxLen) {
    minLen = minLen || 6;
    maxLen = maxLen || 16;
    if (value.length >= minLen && value.length <= maxLen) {
        return true;
    } else {
        return false;
    }
}

/**
 * Func isEmptyForm
 * 
 * @param {String} value 
 * @returns {Boolean}
 */
function isNotEmptyForm(value) {
    return value.length !== 0 ? true : false;
}

/**
 * Func matchPswd
 * 
 * @param {String} value 
 * @returns {Boolean}
 */
function matchPswd(value) {
    return REG.pswd.test(value);
}

/**
 * dealEmailCountingDown
 * 
 * @param {Object} jqObj 
 * @param {Function} beginCB 
 * @param {Function} endCB 
 */
function dealEmailCountingDown(jqObj, beginCB, endCB) {
    jqObj = (jqObj instanceof $) ? jqObj : $(jqObj);
    if (beginCB && beginCB instanceof Function) {
        beginCB(jqObj);
    }
    countingDown(jqObj, 60, endCB)();
}

/**
 * Func countingDown
 * 
 * @param {Object} obj 
 * @param {Number} count 
 * @param {Function} callback 
 * @returns {Function}
 */
function countingDown(obj, count, callback) {
    return function() {
        count -= 1;
        $(obj).text(count + '秒后重新获取验证码');
        var timer = null;
        if (count !== 0) {
            timer = setTimeout(countingDown($(obj), count, callback), 1000);
        } else {
            clearTimeout(timer);
            $(obj).text('获取邮箱验证码');
            if (callback && callback instanceof Function) {
                callback(obj);
            }
        }
    }
}