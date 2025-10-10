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



// 04. 메인(hero)섹션,  스크롤 시 글씨 바뀌기
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector("#hero");
  const content1 = document.querySelector(".hero-content1");
  const content2 = document.querySelector(".hero-content2");
  const bgItems = document.querySelectorAll(".hero-bg .bg-item");

  let step = 0; // 0 = content1, 1 = content2, 2 = 다음 섹션
  let isAnimating = false;

  // 초기 상태
  content1.style.opacity = "1";
  content2.style.opacity = "0";
  content1.style.transition = "opacity 1s ease";
  content2.style.transition = "opacity 1s ease";

  function showContent1() {
    content1.style.opacity = "1";
    content2.style.opacity = "0";
  }

  function showContent2() {
    content1.style.opacity = "0";
    content2.style.opacity = "1";
  }

  function handleScroll(e) {
    if (isAnimating) return;
    if (!hero.contains(document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2))) return;

    e.preventDefault();
    isAnimating = true;

    if (e.deltaY > 0) { // 아래로
      if (step === 0) {
        showContent2();
        step = 1;
        setTimeout(() => (isAnimating = false), 1200); // 애니메이션 끝날 때까지 고정
      } else if (step === 1) {
        const nextSection = hero.nextElementSibling;
        if (nextSection) {
          setTimeout(() => {
            nextSection.scrollIntoView({ behavior: "smooth" });
            step = 2;
            setTimeout(() => (isAnimating = false), 1000);
          }, 300); // 약간 딜레이 후 넘어가기
        } else {
          isAnimating = false;
        }
      } else {
        isAnimating = false;
      }
    } else if (e.deltaY < 0) { // 위로
      if (step === 1) {
        showContent1();
        step = 0;
        setTimeout(() => (isAnimating = false), 1200);
      } else if (step === 2) {
        const prevSection = hero.previousElementSibling;
        if (prevSection) {
          setTimeout(() => {
            prevSection.scrollIntoView({ behavior: "smooth" });
            step = 1; // 돌아왔을 때 content2 유지
            setTimeout(() => (isAnimating = false), 1000);
          }, 300);
        } else {
          isAnimating = false;
        }
      } else {
        isAnimating = false;
      }
    }
  }

  // === 패럴랙스 효과 ===
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  function handleMouseMove(e) {
    targetX = (e.clientX / window.innerWidth - 0.5) * 30; // -15px ~ +15px
    targetY = (e.clientY / window.innerHeight - 0.5) * 30; // -15px ~ +15px
  }

  function animateParallax() {
    // 보간 (lerp)으로 부드럽게 따라오기
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    bgItems.forEach((item, index) => {
      const speed = (index + 1) * 0.3; // 레이어마다 속도 차이
      item.style.transform = `translate(${currentX * speed}px, ${currentY * speed}px)`;
    });

    requestAnimationFrame(animateParallax);
  }

  window.addEventListener("wheel", handleScroll, { passive: false });
  hero.addEventListener("mousemove", handleMouseMove);

  animateParallax(); // 패럴랙스 루프 시작
});










// 05.프로필
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const profileSection = document.querySelector(".profile-info");

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: profileSection,
      start: "top 80%",
      end: "bottom top", // 섹션이 화면에서 벗어날 때까지
      toggleActions: "play reverse play reverse", // 반복 가능
      markers: false
    }
  });

  // 1단계: My Profile + 이미지
  tl.from(".profile-info .en2", {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: "power2.out"
  })
  .from(".profile-wrapper .profile-img", {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: "power2.out"
  }, "<"); // 동시에 실행

  // 2단계: introduce (h2 + p)
  tl.from(".profile-info .introduce > *", {
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
  });

  // introduce가 등장할 때 labels 같이 나오기
  tl.from(".profile-wrapper .label-name1, .profile-wrapper .label-name2, .profile-wrapper .label-name3, .profile-wrapper .download-link", {
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.15,
    ease: "power2.out"
  }, "<"); // introduce와 거의 동시에

  // 3단계: detail
  tl.from(".profile-info .detail", {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: "power2.out"
  });
});











// 06. interest
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const section = document.querySelector(".interest");
  const wrapper = section.querySelector(".img-wrapper");
  const searchbar = wrapper.querySelector(".searchbar");
  const imgs = gsap.utils.toArray(".img-wrapper img");

  const sbRect = searchbar.getBoundingClientRect();
  const sbCx = sbRect.left + sbRect.width / 2;
  const sbCy = sbRect.top + sbRect.height / 2;

  imgs.forEach((img) => {
    const r = img.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    const imgW = r.width;
    const imgH = r.height;

    const targetX = r.left - wrapperRect.left;
    const targetY = r.top - wrapperRect.top;

    const startX = sbCx - wrapperRect.left - imgW / 2;
    const startY = sbCy - wrapperRect.top - imgH / 2;

    const offsetX = startX - targetX;
    const offsetY = startY - targetY;

    // 초기 상태 (searchbar에서 모여있음)
    gsap.set(img, {
      x: offsetX,
      y: offsetY,
      scale: 0.7,  // 🔥 크기 변화 폭 줄임 (0.25 → 0.7)
      opacity: 0,
      position: "absolute",
      left: targetX,
      top: targetY,
      zIndex: 1,
    });

    // 등장 (searchbar → 자리)
    gsap.to(img, {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top center",
        end: "center center",
        scrub: true,
      },
    });

    // 사라짐 (자리 → searchbar)
    gsap.to(img, {
      x: offsetX,
      y: offsetY,
      scale: 0.7,  // 🔥 줄어드는 크기도 0.7으로 맞춤
      opacity: 0,
      ease: "power2.in",
      scrollTrigger: {
        trigger: section,
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  // 텍스트 순차 등장 (왼쪽 영역 h1, p)
  gsap.from(".interest .left > *", {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.2, // 🔥 순차적
    ease: "power2.out",
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
    },
  });
});





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




// [ 스크립트 6 - con1 의 textAni 텍스트 체인지 gsap(쥐삽) 애니메이션 ]       
let textAniList = document.querySelectorAll(".footer .textAni li");
let textAni = new gsap.timeline({ repeat: -1 });

for (let i = 0; i < textAniList.length; i++) { // index를 지정하는 전통적인 for문 (그냥 외우도록)
                                               // for 반복문에서 index 활용 참고 url -> https://learnjs.vlpt.us/basics/08-loop.html
	textAni.to(textAniList[i], 0.8, { opacity: 1, repeat: 1, delay: 0, x: 0,  yoyo: true , ease: "power4.out"});
    // ease 타이밍 참고 url -> https://greensock.com/docs/v3/Eases
}
textAni.play();    
  


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
      markers: false
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