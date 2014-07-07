$(function () {
    //点击抽奖 弹出窗口
    $('#win_btn').on('click',function () {
        $('#login').show().removeClass("fadeout").removeClass("fadeoutleft");
    });
    //点击弹出框关闭按钮
    $('#close_login_pop').on('click',function () {
        $('#login').addClass("fadeout");
    });

    //点击注册弹出窗口
    $('#regsiter_text').on('click',function () {
    $('#login').addClass("fadeoutleft");
    $('#register').show().addClass("fadeinright");
    });
    //点击弹出框关闭按钮
    $('#close_register_pop').on('click',function () {
        $('#register').removeClass("fadeinright").addClass("fadeout");
    });



})