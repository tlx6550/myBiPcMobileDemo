(function(){
    //点击一级目录
    $('.first-leve-div span').click(function(e){
        e.stopPropagation();
        $(this).next('ul').slideToggle();
    })
    // 点击二级目录
    $('.second-leve-ul a').click(function(e){
        e.stopPropagation();
        e.preventDefault();
        var second_leve_ul = $(this).parent().next('ul');
        // 如果没有三级菜单
        if (second_leve_ul.length == 0) {
            //清除li的激活样式
            $('.second-leve-ul').find('li').removeClass('active');           
            $(this).parent('li').addClass('active');
            //移动端点击菜单改变顶部标题，便于清楚知道选择了什么栏目
            var titleText = $(this).text();
            phoneChangeTitle (titleText);
            var thatTaget = $(this),
                _url      = thatTaget.attr('href');
            outNumberTab(thatTaget,titleText)
            // addTab(thatTaget,titleText);
            // showIframeContent(thatTaget,_url)
            //点击目标链接之后要做的逻辑放在这里（如跳转页面）
            console.log('doSomeThing')
             //注意：最后要执行该方法，让菜单卷起
             if ( $('#right-top-button').css('display') == 'block') {
                 $('#right-top-button').click();
               }
        }else {
            //移动端点击菜单改变顶部标题，便于清楚知道选择了什么栏目
            var titleText = $(this).text();
            phoneChangeTitle (titleText);
            second_leve_ul.slideToggle();
        }
    });
    //点击左侧伸缩按钮
    function pullLeft(){
        $('.pull-left-target').on('click',function(e){
        e.stopPropagation();
        //将两个推拉按钮统一起来
        var that          = ($(this).children().length == 0) ? $(this) : $(this).children(),
            targetMove    = $('.bi-director-left'),
            cssLeftString = targetMove.css('left').split('px')[0], 
            cssLeft       = parseInt(cssLeftString),
            leftWidth     = targetMove.outerWidth();
        if (cssLeft >= 0) {
            // 左侧菜单向左边移动
            $('.bi-director-left').animate({left:-leftWidth+'px'});
            that.addClass('icon-caret-right').removeClass('icon-caret-left');
            //右边内容区撑满屏幕
            $('.sidebar').css('position','absolute');
            $('.main').removeClass('col-sm-9 col-md-9 col-lg-10');
        }else if ( cssLeft < 0) {
            $('.bi-director-left').animate({left:0});
           that.addClass('icon-caret-left').removeClass('icon-caret-right');
            $('.main').addClass('col-sm-9 col-md-9 col-lg-10');
            $('.sidebar').css('position','relative');
        }
    })
 }
   pullLeft();

//动态设置左侧菜单栏高度
function reloadChangeSize(){
    $('.bi-director-left').css('height',function () {
     if ( window.innerHeight){
     var winHeight=0;
     winHeight = window.innerHeight;
     }else if((document.body) && (document.body.clientHeight)){
     winHeight = document.body.clientHeight;
        }
        return winHeight;
    })
}   

function browserRedirect() {
        var sUserAgent  = navigator.userAgent.toLowerCase(),
            bIsIpad     = sUserAgent.match(/ipad/i) == 'ipad',
            bIsIphoneOs = sUserAgent.match(/iphone os/i) == 'iphone os',
            bIsMidp     = sUserAgent.match(/midp/i) == 'midp',
            bIsUc7      = sUserAgent.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4',
            bIsUc       = sUserAgent.match(/ucweb/i) == 'ucweb',
            bIsAndroid  = sUserAgent.match(/android/i) == 'android',
            bIsCE       = sUserAgent.match(/windows ce/i) == 'windows ce',
            bIsWM       = sUserAgent.match(/windows mobile/i) == 'windows mobile',
            isPhone     = (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM);
        //如果不在移动端
        if (!isPhone) {
            //pc端则动态执行左侧菜单高度
             reloadChangeSize();
        } else if ( bIsIpad) {
            // $(".pull-left-btn").show();
            $('#left-button-flex').hide();
        }else{
          $('.nav-sidebar').addClass('in').attr('aria-expanded',true);
           return isPhone;
        }

}
var isPhone =  browserRedirect();
//改变顶部标题
function phoneChangeTitle (titleText){
    if (isPhone) {
    var phoneTitle = $('.navbar-brand');
    phoneTitle.text(titleText);
    }
}
//改变tab标签
function addTab(thatTaget,titleText){
    $('#myTab').css('display','block');
    $('.tab-navigation').show();
    $('.pull-left-btn').show();
    var $_thatTaget  = thatTaget,
        _titleText   = titleText,
        _thatTagetId = $_thatTaget.attr('data-id'),
        tagClick     = false;  
        //标识已经被点击过
        $_thatTaget.data('tagClick');
        locationIframe(thatTaget);
        if (!$_thatTaget.data('tagClick')) {
            var $mytab = $('#myTab');
            $mytab.find('a').attr('aria-expanded',false);   
             var aHtml = '<li class="active">'+'<a href=#'+_thatTagetId+' data-toggle=tab aria-expanded=true  data-id='+_thatTagetId +
             '>'+ _titleText +'<i class="tap-icon icon-remove-sign">'+'</i>'+'</a>'+'</li>';
             $mytab.find('li').removeClass('active');
             $mytab.append(aHtml);

             showIframeContent(thatTaget)
             $_thatTaget.data('tagClick',true);
        }

}
//显示iframe内容
function showIframeContent(thatTaget){
   var _thatTagetId = thatTaget.attr('data-id'),
               _url = thatTaget.attr('href');
    $('#myTabContent').find('.tab-pane').removeClass('in active');
    var tabHtml = '<div class="tab-pane fade in active" id='+_thatTagetId+'>'+
    '<iframe frameborder="0" src='+_url+'>'+'</iframe>'+'</div>';
    $('#myTabContent').append(tabHtml);
}
//定位iframen内容
function locationIframe(thatTaget){
    var _thatTagetId = thatTaget.attr('data-id'),
            tabPanes = $('#myTabContent').find('.tab-pane');
    //定位iframe
    tabPanes.each(function(){
        var theTabKey = $(this).attr('id');
        if ( _thatTagetId == theTabKey ) {
            tabPanes.removeClass('in active');
            $(this).addClass('in active');
        }
    })
   //改变页签状态
   var topTabs = $('#myTab').find('a');
   topTabs.each(function(){
       var theTopTabKey = $(this).attr('data-id');
       if ( _thatTagetId == theTopTabKey ) {
        $('#myTab').find('li').removeClass('active').children('a').attr('aria-expanded',false);
        $(this).parent().addClass('active');
        $(this).attr('aria-expanded',true);
       }
   })
}

// 点击导航栏相应选项卡-选项卡删除
$('#myTab').delegate('i','click',function(e){
    e.stopPropagation();
    var _seft = $(this);
    var $myTarget = $(e.target);
    var myRmoveLi =_seft.parent().parent(); 
    var myRmoveId = _seft.parent().attr('data-id');
    //删除iframe
    var  myRmoveTab = $('#myTabContent').children();
    //是否有激活的active类
    var isActive = myRmoveLi.hasClass('active');
    //如果删除的不是当前激活状态的li标签，则直接删除
    if(!isActive){
        myRmoveLi.remove();
        delIframe();
    }else{
            var preTab = myRmoveLi.prev(),
            nextTab = myRmoveLi.next(),
            //删除页签后真正要展示的iframe标记
            theShowIframId = null;
            myRmoveLi.remove();
        //如果删除的不是最左边的页签，则默认向之前一个挪动
        if (preTab.length !=0 ) {
            preTab.addClass('active');
            preTab.children().attr('aria-expanded',true);
            theShowIframId = preTab.children('a').attr('data-id');
        }else{
            nextTab.addClass('active');
            nextTab.children().attr('aria-expanded',true);
            theShowIframId = nextTab.children('a').attr('data-id');
           }
        delIframe();
        //展示删除iframe后激活状态的iframe   
         myRmoveTab.each(function(){
            var showTabId = $(this).attr('id');
                if (showTabId == theShowIframId) {
                //展示激活iframe
                 $(this).addClass('active in'); 
                 return false;
            }
         })
    }

    //解除mytag.data
    $('.bi-director-left').find('a').each(function(){
        var myHrefId = $(this).attr('data-id');
        if (myHrefId == myRmoveId) {
            $(this).data('tagClick',false);
            return false;
        } 
     });
    //删除iframe
    function delIframe(){
       myRmoveTab.each(function(){
            var myRmoveTabId = $(this).attr('id');
                if (myRmoveId == myRmoveTabId) {
                 $(this).remove(); 
                return false;
            } 
        })
    }

    //如果都删除完了就隐藏
     if ($('#myTab').children().length == 0) {
        $('#myTab').hide();
        $('.tab-navigation').hide();
        $('.pull-left-btn').hide();
     }

})

// 顶部页签超过一定数量处理
function outNumberTab(thatTaget,titleText){ 
    var numLis = $('#myTab').children('li').length;
    if (numLis <= 5) {
         addTab(thatTaget,titleText);
    }else{
       showMyModal();
    }
}
//点击前进后退页签按钮
$('.tab-navigation button').click(function(e){
    e.stopPropagation;
    var _thatBtn = $(this),
   _thatLiActive = null;
     $('#myTab').children('li').each(function(e){
        if ($(this).hasClass('active')) {
         _thatLiActive = $(this);
         if (_thatBtn.attr('id') == 'backwordbtn') {
            _thatLiActive.prev('li').children('a').tab('show');
             return false;
         }else if(_thatBtn.attr('id') == 'forwardbtn'){
            _thatLiActive.next('li').children('a').tab('show');
            return false;
         }
        }
    })
})

//点击右上角伸缩按钮
$('#shrinktn').click(function(e){
    e.stopPropagation;
    $(this).children().toggleClass('icon-chevron-down');
    $('.bi-director').fadeToggle();

})
//显示提示多打开的模态框
function showMyModal(){
    $('#myModal').modal('show');
}
function hideMyModal(){
    $('#myModal').modal('hide');
    clearInterval(hideTime);  
}
var hideTime;
$('#myModal').on('show.bs.modal', function () {
  hideTime = window.setTimeout(hideMyModal,2000)
})
//时间控件
$('#flatpickr-tryme').flatpickr();   
})()


