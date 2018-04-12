/**
 * Created by Jepson on 2018/4/11.
 */


$(function() {

  $('#btn_login').click(function() {
    var username = $('[name=username]').val();
    var password = $('[name=password]').val();

    if ( !username ) {
      mui.toast( "请输入用户名" );
      return;
    }

    if ( !password ) {
      mui.toast( "请输入密码" );
      return;
    }

    $.ajax({
      type: "post",
      url: "/user/login",
      data: {
        username: username,
        password: password
      },
      success: function( info ) {
        console.log(info);
        if ( info.error ) {
          mui.toast( info.message );
        }
        if ( info.success ) {
          // 成功了跳转到哪 ???
          // 1. 判断, 有 retUrl参数, 是购物车或者其他页面, 跳过来, 需要往回跳, 跳转到指定的地址
          // 2. 没有 retUrl 参数, 说明直接访问 login, 应该跳到 用户中心
          if ( location.search.indexOf( "retUrl" ) !== -1 ) {
            location.href = location.search.replace("?retUrl=", "");
          } else {
            // 直接访问用户中心
            location.href = "user.html";
          }
        }
      }
    })
  })
})