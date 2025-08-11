//1.스크립트 위로 튕기는것
$(document).on('click', 'a[href="#"]', function(e){
  e.preventDefault();
});



//  header 흰색 부분 나오게 하기
$(function() {
  let lastScroll = 0;
  let $header = $('header');
  let $logo = $('.logo img'); // 로고 이미지 선택자
  let $icon = $('.icon'); // 아이콘 선택자

$(window).on('scroll', function() {
  let currentScroll = $(this).scrollTop();

  if (currentScroll > lastScroll) {
    // 스크롤 내릴 때
    $header.addClass('scroll-hide')
          .css('transform', 'translateY(-100%)')
          .css('background-color', '#fff')
          .css('color', '#333');
    $logo.css({
      'transform': 'scale(0.7)',
      'filter': 'brightness(0%)',
      'transition': 'all 0.3s ease'
    });
    $icon.css({
      'filter': 'brightness(0%)', // 아이콘 색상 변경 (어두운 색으로)
      'transition': 'all 0.3s ease'
    });
  } else {
    // 스크롤 올릴 때
    $header.removeClass('scroll-hide')
          .css('transform', 'translateY(0)')
          .css('background-color', '')
          .css('color', '');
    $logo.css({
      'transform': '',
      'filter': '',
      'transition': 'all 0.3s ease'
    });
    $icon.css({
      'filter': 'brightness(100%)', // 아이콘 색상 원래대로
      'transition': 'all 0.3s ease'
    });
  }

  lastScroll = currentScroll;
});
});



// products slide
$(function(){
  var $inner = $('.product .inner');
  var $list  = $inner.find('ul');
  var isDown = false;
  var startX = 0;
  var baseX  = 0;
  var minX, maxX, extra;

  // 1. bounds 계산 & 초기 정렬
  function calcBounds(){
    var vpW   = $inner.innerWidth();
    var listW = $list.outerWidth();
    minX = vpW - listW;       // UL이 왼쪽으로 최대 이동할 때
    maxX = 0;                 // UL이 오른쪽으로 최대 이동할 때
    if (minX > 0) minX = 0;

    // extra = 뷰포트 폭의 10%
    extra = vpW * 0.1;

    // 초기 정렬: 오른쪽 끝
    baseX = maxX;
    $list.css('transform','translateX('+ baseX +'px)');
  }
  calcBounds();
  $(window).on('resize', calcBounds);

  // 2. 드래그 시작
  $inner.on('mousedown touchstart', function(e){
    isDown = true;
    startX = e.pageX || e.originalEvent.touches[0].clientX;
    // 현재 translateX 읽기
    var m = $list.css('transform').match(/matrix.*\((.+)\)/);
    baseX = m ? parseFloat(m[1].split(', ')[4]) : 0;
    $inner.addClass('is-dragging');
    e.preventDefault();
  });

  // 3. 드래그 중
  $inner.on('mousemove touchmove', function(e){
    if (!isDown) return;
    var x     = e.pageX || e.originalEvent.touches[0].clientX;
    var delta = x - startX;
    var tx    = baseX + delta;
    // 여기서 clamp!
    tx = Math.min(tx, maxX);
    tx = Math.max(tx, minX);
    $list.css('transform','translateX('+ tx +'px)');
  });

  // 4. 드래그 끝
  $(document).on('mouseup touchend touchcancel', function(){
    if (!isDown) return;
    isDown = false;
    $inner.removeClass('is-dragging');
    // 최종 위치 저장
    var m = $list.css('transform').match(/matrix.*\((.+)\)/);
    baseX = m ? parseFloat(m[1].split(', ')[4]) : 0;
  });
});

  // 5. btn 작동
  var itemW    = $list.find('li').outerWidth(true);
  var slideAmt = itemW * 6.3;

  $('.scroll-left').on('click', function(e){
    e.preventDefault();
    var tx = baseX + slideAmt;
    if (tx > maxX) tx = maxX;
    $list.css('transform','translateX('+ tx +'px)');
    baseX = tx;
  });

  $('.scroll-right').on('click', function(e){
    e.preventDefault();
    var tx = baseX - slideAmt;
    if (tx < minX) tx = minX;
    $list.css('transform','translateX('+ tx +'px)');
    baseX = tx;
  });
});




// country 창 여닫기
$(function(){
  // box3 안에서, li > a > p span img 를 클릭했을 때
  $('.box3').on('click', 'li > a', function(e){
    e.preventDefault();  // 앵커 기본 동작 막기

    // 클릭된 img 가 속한 li 요소 찾기
    var $li = $(this).closest('li');

    // 같은 li 안의 .country 를 slideToggle
    $li.find('.country').stop(true, true).fadeToggle(100);
  });
});