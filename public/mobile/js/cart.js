/**
 * Created by Jepson on 2018/4/11.
 */
$(function() {

  function render() {
    // 重置价格
    $('.lt_total span').text( "00.00" );

    setTimeout(function() {

      // 查询购物车信息, 渲染页面
      $.ajax({
        type: "get",
        url: "/cart/queryCart",
        success: function( info ) {
          console.log(info);
          if ( info.error ) {
            // 说明没登陆, 跳转到登录页面
            location.href = "login.html?retUrl=" + location.href;
          }
          else {
            // 说明登录了
            $('#cartList').html( template( "cartTpl", { list: info } ) );

            // 结束下拉刷新
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
          }
        }
      });

    }, 500)
  }

  // 1. 配置下拉刷新
  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down : {
        auto: true, // 页面进行, 自动下拉刷新一次
        callback : function() {
          console.log(111);
          render();
        } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      }
    }
  });


  // 2. 删除功能
  $('#cartList').on("tap", ".btn_delete", function() {
    var proId = $(this).data("id");

    mui.confirm("您是否要删除该商品", "温馨提示", ["确认", "取消"], function( e ){
      if (e.index === 0) {
        $.ajax({
          url: "/cart/deleteCart",
          type: "GET",
          data: {
            id: [ proId ],
          },
          success: function( info ) {
            console.log(info);
            if ( info.success ) {
              mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
            }
          }
        })
      }
    })
  });


  // 3. 修改功能
  // (1) 给修改功能注册点击事件(代理)
  // (2) 获取到对应的数据
  // (3) 将得到的数据显示到 mui.confirm 框中
  // (4) 修改尺码和数量
  // (5) 点确定, 发送 ajax 请求, 修改数据库
  // (6) 下拉一次

  $('#cartList').on("tap", ".btn_edit", function() {
    console.log(this.dataset);
    var productId = this.dataset.id;
    var htmlStr = template( "editTpl", this.dataset );
    htmlStr = htmlStr.replace(/\n/g, "");

    // mui.confirm 会将 html 中所有的换行, 替换成 br
    mui.confirm( htmlStr, "编辑商品", ["确定", "取消"], function( e ) {
      if (e.index === 0) {
        var num = $('.mui-numbox-input').val();
        var size = $('.lt_size .current').text();

        $.ajax({
          url: "/cart/updateCart",
          type: "POST",
          data: {
            id: productId,
            num: num,
            size: size
          },
          success: function( info ) {
            console.log(info);
            if ( info.success ) {
              // 页面刷新重新加载, 下拉刷新
              mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
            }
          }
        });
      }
    });

    // 初始化 numberbox
    mui('.mui-numbox').numbox()

  });

  // 选择尺码事件委托
  $('body').on("click", ".lt_size span", function() {
    $(this).addClass("current").siblings().removeClass("current");
  });

  // 计算总金额
  $('#cartList').on("change", '.ck', function() {
    // 找到所有的checkbox, 遍历, 计算金额
    var total = 0;

    // 遍历所有所中的 checkbox
    $(".ck:checked").each(function() {
      // 获取到当前checkbox的数量和价格
      var price = $(this).data("price");
      var num = $(this).data("num");
      total += price * num;
    });

    total = total.toFixed( 2 );
    $('.lt_total span').text( total );
  })

})