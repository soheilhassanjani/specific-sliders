const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const navs = document.querySelectorAll(".nav");
const slideNumber = document.querySelector(".slide-number");
const next = document.querySelector(".btn-next");
const prev = document.querySelector(".btn-prev");
let lastRequestTime = 0;
let slideNumActive = 0;

next.addEventListener("click", () => {
  if (new Date().getTime() - lastRequestTime >= 1800) {
    lastRequestTime = new Date().getTime();
    if (slideNumActive + 1 >= slides.length) {
      slideNumActive = 0;
    } else {
      slideNumActive += 1;
    }
    changeSlide(`${slideNumActive}`, 1800);
  }
});

prev.addEventListener("click", () => {
  if (new Date().getTime() - lastRequestTime >= 1800) {
    lastRequestTime = new Date().getTime();
    if (slideNumActive - 1 <= 0 ) {
      slideNumActive = slides.length - 1;
    } else {
      slideNumActive -= 1;
    }
    changeSlide(`${slideNumActive}`, 1800);
  }
});

navs.forEach((nav) => {
  nav.addEventListener("click", (ev) => handleEventNav(ev, 1800));
});

function handleEventNav(ev, duration) {
  if (new Date().getTime() - lastRequestTime >= duration) {
    lastRequestTime = new Date().getTime();
    let num = ev.currentTarget.dataset.num;
    changeSlide(num, duration);
  }
}

function changeSlide(num, duration) {
  slideNumActive = Number(num);
  slideNumber.innerHTML = makeNumberSlide(slideNumActive);
  // effect
  let currentNav = findNav(num);
  let currentSlide = findSlide(num);
  let detail = currentSlide.querySelector(".slide__detail");
  let animationDuration =
    parseFloat(
      getComputedStyle(detail).getPropertyValue("animation-duration")
    ) * 1000;
  let lastActiveSlide = findActiveSlide();
  currentNav.classList.add("nav--hide");
  lastActiveSlide.classList.add("slide--to-hide");
  setPropertySlide(currentSlide, num);
  currentSlide.classList.add("slide--to-active");
  sortNavs(num, duration);
  setTimeout(() => {
    resetSlideClass();
    detail.classList.add("slide__detail--to-active");
    currentSlide.classList.add("slide--active");
    currentNav.classList.remove("nav--hide");
    setTimeout(() => {
      detail.classList.remove("slide__detail--to-active");
      detail.classList.add("slide__detail-active");
    }, animationDuration);
  }, duration);
}

function makeNumberSlide(num) {
  if (num.toString().length >= 2) {
    return num;
  } else {
    return `0${num}`;
  }
}

function sortNavs(num, duration) {
  navs.forEach((nav, index, arr) => {
    if (index - num >= 0) {
      nav.style.setProperty("--num", index - num);
    } else {
      nav.classList.add("nav--down");
      setTimeout(() => {
        nav.classList.remove("nav--down");
      }, duration);
      nav.style.setProperty("--num", index - num + arr.length);
    }
  });
}

function resetSlideClass() {
  slides.forEach((slide) => {
    let detail = slide.querySelector(".slide__detail");
    detail.classList.remove("slide__detail-active");
    slide.classList.remove("slide--active");
    slide.classList.remove("slide--to-active");
    slide.classList.remove("slide--to-hide");
  });
}

function setPropertySlide(slide, num) {
  let { top, left, width, height } = calRectPercentRatioSlider(num);
  slide.style.setProperty("--top", `${top}%`);
  slide.style.setProperty("--left", `${left}%`);
  slide.style.setProperty("--width", `${width}%`);
  slide.style.setProperty("--height", `${height}%`);
}

function calRectPercentRatioSlider(num) {
  let {
    width: sliderWidth,
    height: sliderHeight,
  } = slider.getBoundingClientRect();
  let { width: widthElement, height: heightElement } = findNav(
    num
  ).getBoundingClientRect();
  let { top, left } = calPosition(num);
  return {
    top: getPercent(top, sliderHeight),
    left: getPercent(left, sliderWidth),
    width: getPercent(widthElement, sliderWidth),
    height: getPercent(heightElement, sliderHeight),
  };
}

function calPosition(num) {
  let parent = findNav(num);
  let top = 0;
  let left = 0;
  while (true) {
    if (parent === slider) break;
    top += Number(
      getComputedStyle(parent).getPropertyValue("top").replace("px", "")
    );
    left += Number(
      getComputedStyle(parent).getPropertyValue("left").replace("px", "")
    );
    parent = parent.parentNode;
  }
  return { top, left };
}
// foo find
function findNav(num) {
  return Array.from(navs).find((nav) => nav.dataset.num === num);
}

function findSlide(num) {
  return Array.from(slides).find((slide) => slide.dataset.num === num);
}

function findActiveSlide() {
  return Array.from(slides).find(
    (slide) => slide.classList.contains("slide--active") === true
  );
}
// utils
function getPercent(value, ratio) {
  return parseFloat((value * 100) / ratio);
}
