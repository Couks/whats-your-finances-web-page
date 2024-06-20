var swiper = new Swiper(".solutionSwiper", {
  autoplay: {
    delay: 1000,
  },
  effect: "coverflow",
  coverflowEffect: { slideShadows: false },
  speed: 5000,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});
