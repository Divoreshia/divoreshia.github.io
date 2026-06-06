const backgrounds = [
    "Hello/media/bg1.png",
    "Hello/media/bg2.png",
    "Hello/media/bg3.jpg",
    "Hello/media/bg4.jpg",
];

const mainWrapper =
    document.querySelector(".mySwiper .swiper-wrapper");

const thumbWrapper =
    document.querySelector(".mySwiper2 .swiper-wrapper");

backgrounds.forEach(src => {
    const img = new Image();
	
    img.src = src;
	
    mainWrapper.insertAdjacentHTML(
        "beforeend",
        `
        <div class="swiper-slide"
             style="background-image:url('${src}')">
        </div>
        `
    );

    thumbWrapper.insertAdjacentHTML(
        "beforeend",
        `
        <div class="swiper-slide">
            <img src="${src}" alt="">
        </div>
        `
    );

});


const thumbInfinite = [];

for(let i = 0; i < 50; i++){
    thumbInfinite.push(...backgrounds);
}
initialSlide: Math.floor(thumbInfinite.length / 2);

const swiperThumb = new Swiper(".mySwiper2", {

    loop: true,
	loopAdditionalSlides: backgrounds.length * 5,
    slidesPerView: 8,

    centeredSlides: true,


    grabCursor: true,

    watchSlidesProgress: true,

    spaceBetween: 15,

    loopAdditionalSlides: backgrounds.length,

    loopedSlides: backgrounds.length

});

const swiperMain = new Swiper(".mySwiper", {

    loop: true,

    effect: "fade",

    speed: 1000,

    autoplay: {
        delay: 7000,
        disableOnInteraction: false
    },

    thumbs: {
        swiper: swiperThumb
    }

});

function updateThumbWidth() {

    const ratio =
        window.innerWidth / window.innerHeight;

    document.querySelectorAll(
        ".mySwiper2 .swiper-slide"
    ).forEach(slide => {

        slide.style.width =
            `${80 * ratio}px`;

    });

}

updateThumbWidth();





let thumbCenterTimer;

function centerActiveThumb() {

    const activeIndex =
        swiperMain.realIndex;

	swiperThumb.slideToLoop(
    swiperMain.realIndex, 800
);

}

function resetThumbCenterTimer() {

    clearTimeout(thumbCenterTimer);

    thumbCenterTimer = setTimeout(() => {

        centerActiveThumb();

    }, 1000);

}

swiperThumb.on("touchStart", resetThumbCenterTimer);

swiperThumb.on("touchMove", resetThumbCenterTimer);

swiperThumb.on("touchEnd", resetThumbCenterTimer);

swiperThumb.on("sliderMove", resetThumbCenterTimer);

swiperMain.on("slideChange", () => {
	
	    swiperThumb.slideToLoop(
        swiperMain.realIndex,
        600
    );
		resetThumbCenterTimer();
});


function updateViewportRatio() {

    const ratio =
        window.innerWidth / window.innerHeight;

    document.documentElement.style.setProperty(
        "--viewport-ratio",
        ratio
    );
}

updateViewportRatio();



document.addEventListener("DOMContentLoaded", () => {

    const toggleBtn = document.getElementById("thumbToggle");
    const thumbSlider = document.querySelector(".mySwiper2");

    toggleBtn.addEventListener("click", () => {
        thumbSlider.classList.toggle("hidden");
    });

});



window.addEventListener("resize", () => {

    updateViewportRatio();
    updateThumbWidth();
    swiperThumb.update();

    requestAnimationFrame(() => {

        swiperMain.update();
        swiperThumb.update();

    });

});
