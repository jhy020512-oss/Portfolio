// slick
$(function(){
    $('.visual .slide') .slick({
        arrow:true,
        dots:false,
        fade:true,
        autoplay:true,
        pauseOnHover: false,
        pauseOnFocus:false
    });                                                                                        
});

 //splitting.js
$(function(){
    Splitting();  //대문자로쓴다!!!
});

$(function(){
    $('.animate').scrolla({
    mobile: true,
    once: false // true로 설정 시 한 번만 작동
    });
});


$(function(){
    $('.animate').scrolla({
        once: false
    });    
});


$(function(){
    let lastScroll = 0;
    $(window).on("scroll", function() {
        const currentScroll = $(this).scrollTop();
        if (currentScroll > lastScroll && currentScroll > 100) {
        // 스크롤을 아래로 내리면 header 숨기기
        $("header").addClass("hide");
    } else {
        // 스크롤을 위로 올리면 header 다시 보이게
        $("header").removeClass("hide");
    }
    lastScroll = currentScroll;
    });
});