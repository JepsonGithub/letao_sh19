/**
 * Created by Jepson on 2018/4/10.
 */

$(function() {

  // 功能1: 渲染商品页面
  // 1. 获取到地址栏中的 productId
  // 2. 发送 ajax 请求, 获取到商品的详细信息
  // 3. 结合模板引擎渲染出来
  var productId = getSearch("productId");

  $.ajax({
    url: "/product/queryProductDetail",
    type: "get",
    data: {
      id: productId
    },
    success: function( info ) {
      console.log( info );
      $('.mui-scroll').html( template( "tpl", info ));

      // 手动初始化轮播图
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
      });

      // 初始化 numberbox
      mui('.mui-numbox').numbox();
    }
  });

  // 注册选择尺码委托事件
  $('.mui-scroll').on("click", ".lt_size span", function() {
    console.log( "呵呵" );
    $(this).addClass("current").siblings().removeClass("current");
  });


  // 功能2: 加入购物车
  $('.add_cart').click(function() {
    var size = $('.lt_size span.current').text();
    var num = $('.mui-numbox-input').val();

    console.log(size);

    if ( !size ) {
      mui.toast( "请选择尺码" )
    }

    $.ajax({
      url: "/cart/addCart",
      type: "post",
      data: {
        productId: productId,
        num: num,
        size: size
      },
      success: function( info ) {
        console.log(info);

        if ( info.error === 400 ) {
          // 跳转到登录页面, 并且把当前页传递过去
          location.href = "login.html?retUrl=" + location.href;
        }

        if ( info.success ) {
          mui.confirm("添加成功", "温馨提示", ["去购物车", "继续浏览"], function( e ) {
            if ( e.index === 0 ) {
              location.href = "cart.html";
            }
          })
        }

      }
    })

  })




})