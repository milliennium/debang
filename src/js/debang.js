$(function(){
    var $imgs = $('.carousel>img'),
        $left = $imgs.siblings('.left'),
        $right = $imgs.siblings('.right'),
        index = 0,
        timer = null,
        curDataLength,
        curDataArr,
        curPage = 1,
        pageLen = 0,
        pagerWidth = 0,
        ID = 'worker';
    var initImage = function(){
        $imgs.css('display','block');
        $imgs.eq(0).css({'width':328,'height':190,'z-index':0,'opacity':0.3,'left':0,'top':90});
        $imgs.eq(1).css({'width':410,'height':238,'z-index':1,'opacity':0.5,'left':43,'top':66});
        $imgs.eq(2).css({'width':512,'height':296,'z-index':2,'opacity':1,'left':86,'top':37});
        $imgs.eq(3).css({'width':640,'height':370,'z-index':3,'opacity':1,'left':130,'top':0});
        $imgs.eq(4).css({'width':512,'height':296,'z-index':2,'opacity':1,'left':301,'top':37});
        $imgs.eq(5).css({'width':410,'height':238,'z-index':1,'opacity':0.5,'left':447,'top':66});
        $imgs.eq(6).css({'width':328,'height':190,'z-index':0,'opacity':0.3,'left':572,'top':90});
    }
    var leftMove = function(){
        $imgs.eq(index % 7).animate({'width':410,'height':238,'opacity':0.5,'left':43,'top':66}).css('z-index',1);
        $imgs.eq((index + 1) % 7).animate({'width':512,'height':296,'opacity':1,'left':86,'top':37}).css('z-index',2);
        $imgs.eq((index + 2) % 7).animate({'width':640,'height':370,'opacity':1,'left':130,'top':0}).css('z-index',3);
        $imgs.eq((index + 3) % 7).animate({'width':512,'height':296,'opacity':1,'left':301,'top':37}).css('z-index',2);
        $imgs.eq((index + 4) % 7).animate({'width':410,'height':238,'opacity':0.5,'left':447,'top':66}).css('z-index',1);
        $imgs.eq((index + 5) % 7).animate({'width':328,'height':190,'opacity':0.3,'left':572,'top':90}).css('z-index',0);
        $imgs.eq((index + 6) % 7).animate({'width':328,'height':190,'opacity':0.3,'left':0,'top':90}).css('z-index',0);
        index--;
    }
    var rightMove = function(){
        $imgs.eq(index % 7).animate({'width':328,'height':190,'opacity':0.3,'left':572,'top':90}).css('z-index',0);
        $imgs.eq((index + 1) % 7).animate({'width':328,'height':190,'opacity':0.3,'left':0,'top':90}).css('z-index',0);
        $imgs.eq((index + 2) % 7).animate({'width':410,'height':238,'opacity':0.5,'left':43,'top':66}).css('z-index',1);
        $imgs.eq((index + 3) % 7).animate({'width':512,'height':296,'opacity':1,'left':86,'top':37}).css('z-index',2);
        $imgs.eq((index + 4) % 7).animate({'width':640,'height':370,'opacity':1,'left':130,'top':0}).css('z-index',3);
        $imgs.eq((index + 5) % 7).animate({'width':512,'height':296,'opacity':1,'left':301,'top':37}).css('z-index',2);
        $imgs.eq((index + 6) % 7).animate({'width':410,'height':238,'opacity':0.5,'left':447,'top':66}).css('z-index',1);
        index++;
    }
    //获取特定页数据
    var getDateOfPage = function(){
        var cnt = 10 * (curPage - 1);
        $('.list_content').each(function(){
            $(this).find('li').each(function(){
                if(curDataArr[cnt]){
                    $(this).show()
                            .text(curDataArr[cnt][$(this).index()]);
                }else{
                    $(this).hide()
                            .text('');
                }
            });
            cnt++;
        });
    };
    //AJAX异步获取数据函数
    var ajaxGetData = function(ID){
        $.ajax({
            type: 'GET',
            url: './src/data/data.txt',
            success: function(data){
                curDataArr = (JSON.parse(data))[ID];
                curDataLength = curDataArr.length;
                pageLen = Math.ceil(curDataLength / 10);
                var circLen = (pageLen > 5) ? 5 : pageLen;
                $('.pager_cell').remove();
                $('.pager_prev,.pager_next').hide(); 

                if(pageLen >= 2){
                    for(var i = 0; i < circLen; i++){
                        $('<li class="pager_cell">' + (i + 1) + '</li>').insertBefore('.pager_next');
                    }
                    $('.pager_next').show();
                    pagerWidth = circLen * $('.pager_cell').outerWidth() + $('.pager_next').outerWidth();
                    $('.pager>ul').width(pagerWidth);
                    $('.pager_cell').eq(curPage - 1).addClass('pager_choose');
                }
                
                getDateOfPage();

            }
        });
    };

    //翻页功能
    $('.pager>ul').on('click','li',function(){
        $(this).trigger('changepage');
        $('.pager>ul').trigger('changewidth');
    }).on('changewidth',function(){
        var wid = 0;
        $('.pager>ul').find('.pager_cell').each(function(){
            wid += $(this).outerWidth();
        });
        if($('.pager_prev').is(':visible')){
            wid += $('.pager_prev').outerWidth();
        }
        if($('.pager_next').is(':visible')){
            wid += $('.pager_next').outerWidth();
        }
        if(wid != pagerWidth){
            pagerWidth = wid;
            $(this).width(pagerWidth);
        }
    }).on('changepage','li',function(){

        if($(this).hasClass('pager_prev')){
            curPage--;
        }else if($(this).hasClass('pager_next')){
            curPage++;
        }else{
            curPage = $(this).text();
        }

        if(curPage > 2 && curPage < pageLen - 1){
            $('.pager_cell').each(function(index){
                $(this).text(curPage - 2 + index);
            });
        }else if(curPage <= 2){
            $('.pager_cell').each(function(index){
                $(this).text(1 + index);
            });
        }else {
            $('.pager_cell').each(function(index){
                $(this).text(pageLen - 4 + index);
            });
        }
        $('.pager_cell:contains(' + curPage + ')').addClass('pager_choose')
            .siblings().removeClass('pager_choose');

        if(curPage > 1){
            $('.pager>ul').find('.pager_prev').show();
        }else{
            $('.pager>ul').find('.pager_prev').hide();            
        }
        if(curPage < pageLen){
            $('.pager>ul').find('.pager_next').show();
        }else{
            $('.pager>ul').find('.pager_next').hide();            
        }
        
        getDateOfPage();
    });


    //AJAX获取数据
    ajaxGetData(ID);
    // 轮播图处理
    initImage();
    timer = setInterval(rightMove,2000);
    $left.click(function(){
        if(!$imgs.eq(0).is(':animated')){
            leftMove();
        }
    });
    $right.click(function(){
        if(!$imgs.eq(0).is(':animated')){
            rightMove();
        }
    });
    $imgs.parent().on('mouseover', function(){
        clearInterval(timer);
    }).on('mouseout', function(){
        timer = setInterval(rightMove,2000);
    });
    // 关键字输入框聚焦失焦处理
    $(".keyword").on('focus', function(){
        if($(this).val() === this.defaultValue){
            $(this).val('');
        }
    }).on('blur', function(){
        if($(this).val() === ""){
            $(this).val(this.defaultValue);
        }
    });
    // 职位选择动态样式处理
    $('.page_nav').on('click','li:not(".nav_choose")',function(e){
        pagerWidth = 0;
        curPage = 1;
        $('.pager>ul').trigger('changewidth');
        $(e.target).addClass('nav_choose')
            .siblings().removeClass('nav_choose');
        ID = this.id;
        ajaxGetData(ID);
    });
    // 城市选择框首字母选择动态样式处理
    $('.city_titile').on('mouseover', 'li', function(){
        var i = $(this).index();
        if(!$(this).hasClass('ct_active')){
            $(this).addClass('ct_active')
                .siblings().removeClass('ct_active')
                .parent().siblings().eq(i).addClass('cd_active')
                .siblings().filter('.city_detail').removeClass('cd_active');
        }
    });
    // 选择城市处理
    $('.city_detail').on('click', 'li', function(){
        $(this).parents('.city').siblings('.position').val($(this).text());
    })
    // 鼠标悬浮出现城市选择框处理
    $('.shadow').on('mouseover', function(){
        $('.city').show()
        .on('mouseover',function(){
            $(this).show();
        })
        .on('mouseout',function(){
            $(this).hide();
        });
    }).on('mouseout', function(){
        $('.city').hide();
    });
});