var swiper = new Swiper(".mySwiper", {
    loop: "true",
    effect: "fade",
    fadeEffect: {crossfade:false},
    speed: 1000,
    delay: 2000,
    autoplay: {enable: true, delay: 7000, disableOnInteraction: false},
    });
 var swiper2 = new Swiper(".mySwiper2", {
      loop: true,
      spaceBetween: 30,
      thumbs: {swiper: swiper},
    });
