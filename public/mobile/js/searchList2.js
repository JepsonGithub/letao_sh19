/**
 * Created by Jepson on 2018/4/10.
 */

$(function() {

  var page = 1; // 全局的page
  var pageSize = 4;
  // render 作用:
  // 1. 获取服务器的数据
  // 2. 拿到数据渲染
  // 问题: 获取数据是一样的, 数据渲染不一样
  function render( callback ) {
    var obj = {};
    obj.proName = $('.lt_search input').val();
    obj.page = page;
    obj.pageSize = pageSize;

    // 加上我们一些可传可不传的参数处理
    var $current = $('.lt_sort .current');

    if ( $current.length > 0 ) {
      // 有这个类, 说明需要排序, 需要加参数,
      // 参数名和参数值  （1升序，2降序）
      var sortName = $current.data("type");
      var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;
      obj[ sortName ] = sortValue;
    }

    setTimeout(function() {
      $.ajax({
        url: "/product/queryProduct",
        type: "get",
        data: obj,
        success: function( info ) {
          // 把渲染的操作放到 callback 中
          callback( info );
        }
      })
    }, 500)
  }


  // 功能1: 页面一进来, 需要渲染一次, proName 来自于 input 框
  var key = getSearch( "key" );
  $('.lt_search input').val(key);


  mui.init({
    // 配置下拉刷新和上拉加载
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down : {
        auto: true,
        callback : function() {
          console.log( "下拉刷新的时候, 可以执行的函数" );
          page = 1;
          render(function( info ) {
            console.log( info );
            $('.lt_product').html( template( "productTpl", info ) );
            // 数据已经加载完成了, 需要把下拉刷新关闭了
            // 结束下拉刷新的函数
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
            // 重新启用上拉加载
            mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
          });
        } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      },
      up : {
        callback : function() {
          console.log( "上拉加载中" );
          // 要加载下一页的数据
          page++;
          render(function( info ) {
            console.log( info );
            // 数据已经加载完成了, 需要把下拉刷新关闭了
            // 结束下拉刷新的函数
            if ( info.data.length > 0 ) {
              $('.lt_product').append( template( "productTpl", info ) );
              // 结束下拉刷新, 且下次还能刷
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh( false );
            } else {
              // 结束下拉刷新, 且没有更多数据了
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh( true );
            }

          });

        } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      }
    }
  });



  // 功能2: 点击搜索按钮, 需要渲染一次, 用户修改了proName
  $('.lt_search button').click(function() {

    // 让容器下拉刷新一下即可
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();

    var key = $('.lt_search input').val();
    var history = localStorage.getItem("search_list") || "[]";
    var arr = JSON.parse( history );
    var index = arr.indexOf( key );
    if ( index !== -1 ) {
      // 有这个key 需要删除
      arr.splice( index, 1 );
    }
    if ( arr.length >= 10 ) {
      arr.pop(); // 删掉最后面一个
    }
    arr.unshift( key );
    localStorage.setItem( "search_list", JSON.stringify(arr) );
  });




  // 功能3: 点击排序的时候, 需要渲染一次(传递更多的参数)
  $('.lt_sort a[data-type]').on("tap", function() {
    console.log(111);
    // 判断当前点击的 a 有没有 current 类
    // 如果有, 切换类
    if ( $(this).hasClass( "current") ) {
      $(this).find("i").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
    } else {
      // 没有这个类 进行排他
      $(this).addClass("current").siblings().removeClass("current");
      // 需要重置所有的箭头, 向下
      $(".lt_sort a i").removeClass("fa-angle-up").addClass("fa-angle-down");
    }

    // 让容器下拉刷新一下即可
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
  })

})
