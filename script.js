/* ==========================================================================
   1. REAL CANVAS ASPECT RATIO 
   ========================================================================== */
   
function updateRatio() {
    const ratio = window.innerWidth / window.innerHeight;
    document.documentElement.style.setProperty('--window-ratio', ratio);
    
    // Thumbnail cập nhật trực tiếp theo resize, không cần delay
    if (window.swiperThumb) window.swiperThumb.update();
    if (window.swiperMain) window.swiperMain.update();
}

window.addEventListener('resize', updateRatio);
updateRatio();

/* ==========================================================================
   2. DATABASE & DOM INJECTION
   ========================================================================== */
const backgrounds = [
    "Hello/media/bg1.jpg", 
	"Hello/media/bg2.jpg",
	"Hello/media/bg3.jpg",
    "Hello/media/bg4.jpg", 
	"Hello/media/bg5.jpg",
	"Hello/media/bg6.jpg",
    "Hello/media/bg7.jpg", 
	"Hello/media/bg8.jpg",
    "Hello/media/bg1.jpg", 
	"Hello/media/bg2.jpg",
	"Hello/media/bg3.jpg",
    "Hello/media/bg4.jpg", 
	"Hello/media/bg5.jpg",
	"Hello/media/bg6.jpg",
    "Hello/media/bg7.jpg", 
	"Hello/media/bg8.jpg",
];

const mainWrapper = document.querySelector(".mySwiper .swiper-wrapper");
const thumbWrapper = document.querySelector(".mySwiper2 .swiper-wrapper");

if (mainWrapper && thumbWrapper) {
    backgrounds.forEach(src => {
        mainWrapper.insertAdjacentHTML("beforeend", `<div class="swiper-slide"><img src="${src}" loading="lazy" class="swiper-image-main" alt="Background"><div class="swiper-lazy-preloader"></div></div>`);
        thumbWrapper.insertAdjacentHTML("beforeend", `<div class="swiper-slide"><img src="${src}" loading="lazy" alt="Thumbnail"></div>`);
    });
}

/* ==========================================================================
   3. INITIALIZE SWIPER
   ========================================================================== */
// Sử dụng window để tránh lỗi phạm vi biến
window.swiperThumb = null;
window.swiperMain = null;

function initSwiperSliders() {
    window.swiperThumb = new Swiper(".mySwiper2", {
        loop: true,
        centeredSlides: true,
        watchSlidesProgress: true,
        spaceBetween: 16,
        slidesPerView: 6,
        slideToClickedSlide: true,
		breakpoints: {
            320: {slidesPerView: 3, spaceBetween: 10},
			640: {slidesPerView: 4, spaceBetween: 20},
			1080: {slidesPerView: 5, spaceBetween: 30}			
        }
    });

    window.swiperMain = new Swiper(".mySwiper", {
        loop: true,
        speed: 1200,
        autoplay: { delay: 7000, disableOnInteraction: false },
        effect: "fade",
        thumbs: { swiper: window.swiperThumb }
    });
}

// Toggle Button

const toggleBtn = document.getElementById("thumbToggle");
const thumbSlider = document.querySelector(".mySwiper2");

toggleBtn.addEventListener("click", () => {
    // Chỉ cần thêm/xóa class .hidden
    thumbSlider.classList.toggle("hidden");
    
    // Đổi tên nút
    const isHidden = thumbSlider.classList.contains("hidden");
    toggleBtn.textContent = isHidden ? "VIEW" : "HIDE";

    // Nếu vừa hiện ra, gọi update() nhẹ để Swiper khớp lại khung hình (nếu cần)
    if (!isHidden) {
        requestAnimationFrame(() => {
            if (window.swiperThumb) window.swiperThumb.update();
        });
    }
});


/* ==========================================================================
   4. LOADERS
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    initSwiperSliders();

    const preloader = document.getElementById("preloader");
    const mask = document.getElementById("loader-mask");
    
    if (mask && preloader) {
        let progress = 0;
        const loaderInterval = setInterval(() => {
            progress++;
            mask.style.transform = `translateX(${progress}%)`;
            if (progress >= 100) {
                clearInterval(loaderInterval);
                preloader.classList.add("fade-out");
                setTimeout(() => preloader.remove(), 800);
            }
        }, 20);
    }
});