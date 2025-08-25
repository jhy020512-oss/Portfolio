// 00. a 속성 제거, 튕김 제거
$(document).on('click', 'a[href="#"]', function(e) {
  e.preventDefault();
});

// 01. Splitting 호출
$(function() {
  Splitting();
});

// 02. header 영역 스크롤 방향 감지
$(function() {
  let preScrollTop = 0;
  $(window).on('scroll', function() {
    let nowScrollTop = $(this).scrollTop();
    if (nowScrollTop > preScrollTop) {
      $('header').addClass('active');
    } else {
      $('header').removeClass('active');
    }
    preScrollTop = nowScrollTop;
  });
});

// 03. scrolla.js
$(function() {
  $('.animate').scrolla({
    mobile: true, // 모바일에서 활성화
    once: false   // 여러 번 실행
  });
});

// ==============================
// GSAP & ScrollTrigger 설정
// ==============================
gsap.registerPlugin(ScrollTrigger);

// #hero 영역 고정 + 글씨 전환
ScrollTrigger.create({
  trigger: ".hero",
  start: "top top",
  end: "bottom+=100% top",

  scrub: true,
  onUpdate: self => {
    const progress = self.progress;
    if (progress < 0.5) {
      gsap.to(".hero .hero-inner .hero-content1", {opacity: 1, duration: 0.3});
      gsap.to(".hero .hero-inner .hero-content2", {opacity: 0, duration: 0.3});
    } else {
      gsap.to(".hero .hero-inner .hero-content1", {opacity: 0, duration: 0.3});
      gsap.to(".hero .hero-inner .hero-content2", {opacity: 1, duration: 0.3});
    }
  }
});







// interest 이미지 보이기/숨기기
const wrapper = document.querySelector('.right .img-wrapper');
if (wrapper) {
  window.addEventListener('scroll', () => {
    const rect = wrapper.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25;
    if (inView) {
      wrapper.classList.add('show');
      wrapper.classList.remove('hide');
    } else {
      wrapper.classList.add('hide');
      wrapper.classList.remove('show');
    }
  });
}

// 텍스트 쪼개기 (Splitting과 별개로 br 포함)
function splitTextWithLineBreaks(selector) {
  document.querySelectorAll(selector).forEach(paragraph => {
    const originalHTML = paragraph.innerHTML;
    paragraph.innerHTML = '';

    const parser = new DOMParser();
    const parsed = parser.parseFromString(`<div>${originalHTML}</div>`, 'text/html').body.firstChild;

    parsed.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split('').forEach(char => {
          const span = document.createElement('span');
          span.textContent = char === ' ' ? '\u00A0' : char;
          span.style.display = 'inline-block';
          paragraph.appendChild(span);
        });
      } else if (node.nodeName === 'BR') {
        paragraph.appendChild(node.cloneNode());
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const wrapper = document.createElement(node.nodeName.toLowerCase());
        for (let attr of node.attributes) {
          wrapper.setAttribute(attr.name, attr.value);
        }
        node.textContent.split('').forEach(char => {
          const span = document.createElement('span');
          span.textContent = char === ' ' ? '\u00A0' : char;
          span.style.display = 'inline-block';
          wrapper.appendChild(span);
        });
        paragraph.appendChild(wrapper);
      }
    });
  });
}



if (window.innerWidth >= 1024) {
  splitTextWithLineBreaks('.kor');
  splitTextWithLineBreaks('.eng');
}
splitTextWithLineBreaks('.about-third .texts p');

gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.matchMedia({
    
      "(min-width: 1621px)": function () {
    
        gsap.timeline({
          scrollTrigger: {
            trigger: '.about-second',
            pin: true,
            pinSpacing: false,
            start: 'center center',
            end: '+=300%',
            scrub: 1,
            transformOrigin: 'center bottom'
          }
        })
        .to('.about-second', { scale: 20, ease: 'none', duration: 1 })
        .to('.about-second .txts', { opacity: 0 });
    
        gsap.timeline({
          scrollTrigger: {
            trigger: '.about-third',
            start: '10% center',
            scrub: 1
          }
        })
        .to('.about .about-third video', { opacity: 1 });
    
      }
    
    });



/* project-sliders.js : teamproject(1/2/3) 공통 슬라이더 */

// DOM 준비되면 실행 (외부파일 안전)
(function () {
  function initAll() {
    document
      .querySelectorAll('.teamproject, .teamproject2, .teamproject3')
      .forEach(initSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // 각 섹션 초기화
  function initSection(section) {
    const slidesContainer = section.querySelector('.slides, .slides2, .slides3');
    const slideNodeList   = section.querySelectorAll('.slide, .slide2, .slide3');
    const dotsContainer   = section.querySelector('.dots, .dots2, .dots3');
    const explainZone     = section.querySelector('.explain-zone, .explain-zone2, .explain-zone3');
    const menuItems       = section.querySelectorAll('.side ul li a, .side2 ul li a, .side3 ul li a');
    const leftArrow       = section.querySelector('.arrow.left');
    const rightArrow      = section.querySelector('.arrow.right');

    // 필수 요소 없으면 패스
    if (!slidesContainer || !slideNodeList.length || !dotsContainer) return;

    const slides = Array.from(slideNodeList);

    // data-section별 그룹핑
    const groups = {};
    slides.forEach((el, globalIndex) => {
      const g = Number(el.dataset.section || 0);
      if (!groups[g]) groups[g] = { slides: [], startIndex: 0 };
      groups[g].slides.push({ el, globalIndex });
    });

    const sectionKeys = Object.keys(groups).map(Number).sort((a, b) => a - b);
    if (!sectionKeys.length) return;

    // 각 그룹 시작 인덱스 계산
    let run = 0;
    sectionKeys.forEach((k) => {
      groups[k].startIndex = run;
      run += groups[k].slides.length;
    });

    let curSection = sectionKeys[0];
    let curIndex = 0;

    // 점 네비 생성/갱신
    function buildDots() {
      dotsContainer.innerHTML = '';
      const len = groups[curSection].slides.length;
      for (let i = 0; i < len; i++) {
        const btn = document.createElement('button');
        if (i === 0) btn.classList.add('active');
        btn.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(btn);
      }
    }

    // 이동 (각 .slide* 가 min-width:100% 라는 전제)
    function goTo(i) {
      const len = groups[curSection].slides.length;
      if (i < 0) i = len - 1;
      if (i >= len) i = 0;
      curIndex = i;

      const globalIndex = groups[curSection].startIndex + curIndex;
      slidesContainer.style.transform = `translateX(-${globalIndex * 100}%)`;

      if (explainZone) {
        const desc = groups[curSection].slides[curIndex].el.dataset.desc || '';
        explainZone.innerHTML = desc; // <br> 포함 허용
      }

      // 점 active
      Array.from(dotsContainer.children).forEach((d, idx) => {
        d.classList.toggle('active', idx === curIndex);
      });
    }

    // 화살표
    leftArrow && leftArrow.addEventListener('click', () => goTo(curIndex - 1));
    rightArrow && rightArrow.addEventListener('click', () => goTo(curIndex + 1));

    // 카테고리 클릭 → 해당 섹션의 첫 슬라이드로
    if (menuItems.length) {
      menuItems.forEach((a, idx) => {
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const targetKey = sectionKeys[idx] ?? 0;
          curSection = targetKey;
          curIndex = 0;

          menuItems.forEach((el) => el.parentElement.classList.remove('active'));
          a.parentElement.classList.add('active');

          buildDots();
          goTo(0);
        });
      });
      // 초기 active
      menuItems[0].parentElement.classList.add('active');
    }

    // 초기화
    buildDots();
    goTo(0);

    // 리사이즈 시 위치 재적용(퍼센트 이동이라 보정만)
    window.addEventListener('resize', () => goTo(curIndex));
  }
})();



// works 타이틀 진입 애니
gsap.timeline({
  scrollTrigger: {
    trigger: '.works',
    start: '0% 100%',
    end: '0% 20%',
    scrub: 1
  }
})
.fromTo('.works .title .a', { x: '-100%' }, { x: '0%', ease: 'none' }, 0)
.fromTo('.works .title .b', { x: '100%' }, { x: '0%', ease: 'none' }, 0);

// worklist 진입 시 애니
gsap.timeline({
  scrollTrigger: {
    trigger: '.worklist',
    start: '0% 100%',
    end: '0% 100%',
    scrub: 1
  }
})
.to('.wrap', { backgroundColor: '#000', color: '#fff', ease: 'none' }, 0)
.to('.works .title', { position: 'fixed', left: 0, top: 0, width: '100%', ease: 'none' }, 0)
.fromTo('.worklist', 
  { margin: '0 auto' }, 
  { margin: '100vh auto 0', position: 'relative', zIndex: 10 }, 0
);



// worklist 끝날 때 타이틀 퇴장
gsap.timeline({
  scrollTrigger: {
    trigger: '.worklist',
    start: '100% 50%',
    end: '100% 0%',
    scrub: 1
  }
})
.to('.works .title .a', { x: '-100%', ease: 'none' }, 0)
.to('.works .title .b', { x: '100%', ease: 'none' }, 0);








// about-product 라인 이동
ScrollTrigger.matchMedia({
  "(min-width: 391px)": function () {
    gsap.timeline({
      scrollTrigger: {
        trigger: '.about-product',
        start: 'top center',
        end:'35% center',
        scrub: true
      }
    })
    .to('.process-line .collection', { x:'-150px', ease: 'none' }, 0)
    .to('.process-line .collection span', { x:'250px', ease: 'none' }, 0)
  }
});





// aboutMore.js
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  // Splitting 실행 — 이 시점이면 HTML이 다 로드됨
  Splitting({ target: ".about-more [data-splitting]" });

  const chars = gsap.utils.toArray(".about-more .char");
  console.log("chars found:", chars.length);

  gsap.fromTo(
    chars,
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      color: "#ffffff",
      stagger: 0.03,
      duration: 0.6,
      ease: "power1.out",
      scrollTrigger: {
      trigger: ".about-more",
      start: "top 80%",
      end: "bottom 60%",
      scrub: 0.5,
      markers: true
      }
    }
  );
});






// 팀프로젝트
const tabs = document.querySelectorAll('.sidebar ul li');
const contentGroups = document.querySelectorAll('.content-group');
const paginationIndicator = document.querySelector('.pagination-indicator');
const prevBtn = document.querySelector('.nav-btn.prev');
const nextBtn = document.querySelector('.nav-btn.next');

let currentGroupIndex = 0;  // 탭 인덱스
let currentContentIndex = 0; // content-box 인덱스

function showGroup(index) {
  currentGroupIndex = index;
  currentContentIndex = 0;

  contentGroups.forEach((group, i) => {
    group.style.display = (i === index) ? 'block' : 'none';
    group.querySelectorAll('.content-box').forEach(box => box.style.display = 'none');
  });

  // 첫번째 content-box 보이기
  const activeGroup = contentGroups[index];
  const boxes = activeGroup.querySelectorAll('.content-box');
  if (boxes.length > 0) {
    boxes[0].style.display = 'block';
  }

  updatePagination();
}

function updatePagination() {
  const activeGroup = contentGroups[currentGroupIndex];
  const boxes = activeGroup.querySelectorAll('.content-box');
  paginationIndicator.textContent = `${currentContentIndex + 1} / ${boxes.length}`;

  prevBtn.disabled = currentContentIndex === 0;
  nextBtn.disabled = currentContentIndex === boxes.length - 1;
}

prevBtn.addEventListener('click', () => {
  const boxes = contentGroups[currentGroupIndex].querySelectorAll('.content-box');
  if (currentContentIndex > 0) {
    boxes[currentContentIndex].style.display = 'none';
    currentContentIndex--;
    boxes[currentContentIndex].style.display = 'block';
    updatePagination();
  }
});

nextBtn.addEventListener('click', () => {
  const boxes = contentGroups[currentGroupIndex].querySelectorAll('.content-box');
  if (currentContentIndex < boxes.length - 1) {
    boxes[currentContentIndex].style.display = 'none';
    currentContentIndex++;
    boxes[currentContentIndex].style.display = 'block';
    updatePagination();
  }
});

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    showGroup(i);
  });
});


// 초기 표시
showGroup(0);