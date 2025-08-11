'use strict';

// a 클릭했을때 위로 튕기는 이벤트제거
$(document).on('click', 'a[href="#"]', function(e){
    e.preventDefault();
});

//gnb 메뉴 
$(function() {
	$('header .menuOpen').on('click', function(){
		$('.gnb').addClass('on');
	});
	$('.gnb .close, section').on('click', function() { //닫기버튼과 섹션영역 클릭시 제거
		$('.gnb').removeClass('on');
	});
});




//fixHeader
var scrollTop = 0;
scrollTop = $(document).scrollTop();
fixHeader();
//윈도우창 조절시 이벤트
$(window).on('scroll resize', function() {
    scrollTop = $(document).scrollTop();
    fixHeader();
});

//고정헤더 함수
function fixHeader() {
    if (scrollTop > 150) { 
        $('header').addClass('on');
    } else {
        $('header').removeClass('on');
    }
}

// 스크롤 애니메이션
$(function() {
	$('.animate').scrolla({
		mobile: true, //모바일버전시 활성화
		once: true //스크롤시 딱 한번만 하고싶을땐 true
	});    
}); 	



//상단이동 부드럽게
$(function() {            
    $('.goTop').on('click', function() {
        const top = $('body').offset().top;  //body의 top의 위칫값을 변수 top한테 저장(대입)
        //offset() 함수는 원하는 선택자의 위치값을 top , left 형식을 반환하여 줍니다.
        $('html, body').animate( { scrollTop : (top) }, 2000 );  
    });     
});  





//.top-visual 이미지슬라이드
    $(function() {
        $(".visual .slide").slick({
            arrows: true, //화살표
            dots: false, //인디케이터 해제
            fade: true, //페이드인 효과
            autoplay: true, //자동재생
            autoplaySpeed: 4000, //재생시간
            pauseOnHover:false, //마우스 오버, 포커스시 멈추는것 해제
		    pauseOnFocus:false
        });
    }); 