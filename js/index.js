function init() {
    HideAlert();

    var getURl = new URL(location.href);
    var token = getURl.searchParams.get('token');
    if (getURl.searchParams.has('token')) {
        $('#row-fgtpw').show();
        $('#row-chgpw').hide();
        var tt = token.split('.');
        $('#ShowAcc').val(tt[0]);
    } else {
        $('#row-fgtpw').hide();
        $('#row-chgpw').show();
    }
}

function FormSubmitListener() {
    $('#form-HasToken').submit(function () {
        HideAlert();
        var getURl = new URL(location.href);
        if (!getURl.searchParams.has('token')) {
            location.replace("./index.html#ChangePW");
            return false;
        }
        var token = getURl.searchParams.get('token');
        var npw = $('#InputNewPw_f').val();
        var npwr = $('#InputNewPwRe_f').val();
        if (npw == "" || npwr == "") {
            $.alert({
                title: '錯誤',
                content: '新密碼或確認新密碼未輸入!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else if (npw != npwr) {
            $('#InputNewPw_f').val('');
            $('#InputNewPwRe_f').val('');
            $.alert({
                title: '錯誤',
                content: '確認新密碼不符合!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else {
            $('#InputNewPw_f').val('');
            $('#InputNewPwRe_f').val('');
            var data = {token: token, new_pswd: npw};
            var res = request('POST', '/pswd/token', data, false);
            if (res.code == 204) {
                ShowAlart('alert-success', '更改成功!!!', false, true);
                setTimeout(function () {
                    location.replace("./index.html#ChangePW");
                }, 2000);
            }
            if (res.code == 403) {
                if (res.data['error'] == 'Verify code expired') {
                    $.alert({
                        title: '錯誤',
                        content: 'Token過期!!請重新申請',
                        type: 'red',
                        typeAnimated: true,
                        onClose: function () {
                            setTimeout(function () {
                                location.replace("./index.html#ChangePW");
                            }, 1000);
                        }
                    });
                }
            }
            if (res.code == 404) {
                if (res.data['error'] == 'The User Not Found') {
                    $.alert({
                        title: '錯誤',
                        content: '使用者錯誤',
                        type: 'red',
                        typeAnimated: true,
                        onClose: function () {
                            setTimeout(function () {
                                location.replace("./index.html#ChangePW");
                            }, 1000);
                        }
                    });
                }
                if (res.data['error'] == 'The Token Not Found') {
                    $.alert({
                        title: '錯誤',
                        content: 'Token錯誤!!請重新申請',
                        type: 'red',
                        typeAnimated: true,
                        onClose: function () {
                            setTimeout(function () {
                                location.replace("./index.html#ChangePW");
                            }, 1000);
                        }
                    });
                }
            }
        }
        return false;
    });
    $('#form-Chgpw').submit(function () {
        HideAlert();
        var acc = $('#InputAcc').val();
        var oldpw = $('#InputOldPw').val();
        var npw = $('#InputNewPw').val();
        var npwr = $('#InputNewPwRe').val();
        if (npw == "" || npwr == "" || acc == "" || oldpw == "") {
            $.alert({
                title: '錯誤',
                content: '未輸入完整!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else if (npw != npwr) {
            $('#InputNewPw').val('');
            $('#InputNewPwRe').val('');
            $.alert({
                title: '錯誤',
                content: '確認新密碼不符合!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else {
            $('#InputNewPw').val('');
            $('#InputNewPwRe').val('');
            var data = {account: acc, old_pswd: oldpw, new_pswd: npw};
            var res = request('POST', '/pswd/account', data, false);
            if (res.code == 204) {
                ShowAlart('alert-success', '成功修改!!!', false, true);
                $('#InputAcc').val('');
                $('#InputOldPw').val('');
            }
            if (res.code == 403) {
                if (res.data['error'] == 'Old password error') {
                    $.alert({
                        title: '錯誤',
                        content: '舊密碼錯誤!!請重新輸入',
                        type: 'red',
                        typeAnimated: true
                    });
                    $('#InputOldPw').val('');
                }
            }
            if (res.code == 404) {
                if (res.data['error'] == 'The User Not Found') {
                    $.alert({
                        title: '錯誤',
                        content: '使用者尚未註冊',
                        type: 'red',
                        typeAnimated: true
                    });
                    $('#InputAcc').val('');
                    $('#InputOldPw').val('');
                }
            }
        }
        return false;
    });
    $('#form-GetToken').submit(function () {
        HideAlert();
        var email = $('#InputEmail').val();
        if (email == "") {
            $.alert({
                title: '錯誤',
                content: 'E-mail未輸入!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else {
            $('#InputEmail').val('');
            var data = {email: email, redirect: 'AdminFrontend'};
            var res = request('POST', '/pswd/forget', data, false);
            if (res.code == 204) {
                ShowAlart('alert-success', '已寄出!!!', false, true);
            }
            if (res.code == 400) {
                if (res.data['error'] == 'Email format error') {
                    $.alert({
                        title: '錯誤',
                        content: 'Email格式錯誤!!請重新輸入',
                        type: 'red',
                        typeAnimated: true
                    });
                }
            }
            if (res.code == 404) {
                if (res.data['error'] == 'The User Not Found') {
                    $.alert({
                        title: '錯誤',
                        content: '使用者尚未註冊',
                        type: 'red',
                        typeAnimated: true
                    });
                }
                if (res.data['error'] == 'The Redirect Not Found') {
                    $.alert({
                        title: '錯誤',
                        content: 'Redirect錯誤!!請聯繫管理員',
                        type: 'red',
                        typeAnimated: true
                    });
                }
            }
        }
        return false;
    });
}
