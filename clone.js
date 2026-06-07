const backgrounds = [
"Hello/media/bg1.png",
"Hello/media/bg2.png",
"Hello/media/bg3.jpg",
"Hello/media/bg4.jpg"
];

const mainWrapper =
document.querySelector(".mySwiper .swiper-wrapper");

const thumbWrapper =
document.querySelector(".mySwiper2 .swiper-wrapper");

/* =====================
BUILD THUMB DATA
===================== */

const thumbData = [];

for(let i = 0; i < 30; i++){
thumbData.push(...backgrounds);
}

/* =====================
BUILD MAIN SLIDES
===================== */

backgrounds.forEach(src => {

```
mainWrapper.insertAdjacentHTML(
    "beforeend",
    `
    <div class="swiper-slide"
         style="background-image:url('${src}')">
    </div>
    `
);
```

});

/* =====================
BUILD THUMB SLIDES
===================== */

thumbData.forEach(src => {

```
thumbWrapper.insertAdjacentHTML(
    "beforeend",
    `
    <div class="swiper-slide">
        <img src="${src}" alt="">
    </div>
    `
);
```

});

/* =====================
THUMB SWIPER
===================== */

const swiperThumb = new Swiper(".mySwiper2", {

```
slidesPerView: "auto",

centeredSlides: true,

freeMode: true,

freeModeMomentum: true,

grabCursor: true,

watchSlidesProgress: true,

spaceBetween: 15
```

});

/* =====================
MAIN SWIPER
===================== */

const swiperMain = new Swiper(".mySwiper", {

```
loop: true,

effect: "fade",

speed: 1000,

autoplay: {
    delay: 7000,
    disableOnInteraction: false
}
```

});

/* =====================
CURRENT THUMB
===================== */

let currentThumbIndex =
Math.floor(
thumbData.length / 2
);

/* =====================
ACTIVE THUMB
===================== */

function updateActiveThumb(){

```
Array.from(
    swiperThumb.slides
).forEach(slide => {

    slide.classList.remove(
        "swiper-slide-thumb-active"
    );

});

swiperThumb.slides[
    currentThumbIndex
]?.classList.add(
    "swiper-slide-thumb-active"
);
```

}

/* =====================
RESPONSIVE WIDTH
===================== */

function updateThumbWidth(){

```
const ratio =
    window.innerWidth /
    window.innerHeight;

document
    .querySelectorAll(
        ".mySwiper2 .swiper-slide"
    )
    .forEach(slide => {

        slide.style.width =
            `${90 * ratio}px`;

    });
```

}

updateThumbWidth();

/* =====================
INITIAL POSITION
===================== */

setTimeout(() => {

```
swiperThumb.slideTo(
    currentThumbIndex,
    0
);

updateActiveThumb();
```

}, 300);

/* =====================
AUTO CENTER
===================== */

let centerTimer;

function centerThumb(){

```
swiperThumb.slideTo(
    currentThumbIndex,
    800
);
```

}

function resetCenterTimer(){

```
clearTimeout(
    centerTimer
);

centerTimer =
    setTimeout(
        centerThumb,
        3000
    );
```

}

/* =====================
THUMB EVENTS
===================== */

swiperThumb.on(
"touchStart",
resetCenterTimer
);

swiperThumb.on(
"touchMove",
resetCenterTimer
);

swiperThumb.on(
"touchEnd",
resetCenterTimer
);

swiperThumb.on(
"sliderMove",
resetCenterTimer
);

swiperThumb.on(
"click",
swiper => {

```
    if(
        swiper.clickedIndex == null
    ) return;

    currentThumbIndex =
        swiper.clickedIndex;

    const realIndex =
        currentThumbIndex %
        backgrounds.length;

    swiperMain.slideToLoop(
        realIndex,
        600
    );

    swiperThumb.slideTo(
        currentThumbIndex,
        600
    );

    updateActiveThumb();

}
```

);

/* =====================
MAIN CHANGE
===================== */

swiperMain.on(
"slideChange",
() => {

```
    const nextReal =
        swiperMain.realIndex;

    const currentReal =
        currentThumbIndex %
        backgrounds.length;

    let diff =
        nextReal -
        currentReal;

    if(diff > 2)
        diff -= backgrounds.length;

    if(diff < -2)
        diff += backgrounds.length;

    currentThumbIndex += diff;

    swiperThumb.slideTo(
        currentThumbIndex,
        600
    );

    updateActiveThumb();

    resetCenterTimer();

}
```

);

/* =====================
VIEWPORT RATIO
===================== */

function updateViewportRatio(){

```
const ratio =
    window.innerWidth /
    window.innerHeight;

document.documentElement
    .style.setProperty(
        "--viewport-ratio",
        ratio
    );
```

}

updateViewportRatio();

/* =====================
TOGGLE THUMB
===================== */

document.addEventListener(
"DOMContentLoaded",
() => {

```
    const toggleBtn =
        document.getElementById(
            "thumbToggle"
        );

    const thumbSlider =
        document.querySelector(
            ".mySwiper2"
        );

    toggleBtn.addEventListener(
        "click",
        () => {

            thumbSlider
                .classList
                .toggle(
                    "hidden"
                );

        }
    );

}
```

);

/* =====================
RESIZE
===================== */

window.addEventListener(
"resize",
() => {

```
    updateViewportRatio();

    updateThumbWidth();

    requestAnimationFrame(
        () => {

            swiperMain.update();

            swiperThumb.update();

        }
    );

}
```

);
