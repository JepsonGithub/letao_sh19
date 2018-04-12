/**
 * Created by Jepson on 2018/4/11.
 */

$(function() {


  // 一进入页面, 请求用户信息, 进行用户信息渲染
  $.ajax({
    url: "/user/queryUserMessage",
    type: "get",
    success: function( info ) {
      if ( info.error ) {
        location.href = "login.html";
        return;
      }

      console.log(info);
      $('#userinfo').html( template( "userTpl", info ) )
    }
  })


  // 退出功能
  $('#btn_logout').click(function() {
    $.ajax({
      url: "/user/logout",
      type: "get",
      success: function( info ) {
        console.log(info);
        if ( info.success ) {
          location.href = "login.html";
        }
      }
    })
  })

})
