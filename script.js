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
window.swiperThumb = null;
window.swiperMain = null;

// Hàm cập nhật màu đèn Active cho Thumbnail dựa vào realIndex chuẩn xác
function syncThumbActive(realIndex) {
    document.querySelectorAll('.mySwiper2 .swiper-slide').forEach(slide => {
        const slideIndex = parseInt(slide.dataset.swiperSlideIndex);
        if (slideIndex === realIndex) {
            slide.classList.add('swiper-slide-thumb-active');
        } else {
            slide.classList.remove('swiper-slide-thumb-active');
        }
    });
}

function initSwiperSliders() {
    // A. Khởi tạo Swiper Thumbnail
    window.swiperThumb = new Swiper(".mySwiper2", {
        loop: true,
        loopedSlides: backgrounds.length, // SỬA: Đặt bằng số lượng ảnh thực tế (8) để tối ưu hóa bộ nhớ DOM
        spaceBetween: 16,
        slidesPerView: 5,           
        centeredSlides: true,
        watchSlidesProgress: true,
        slideToClickedSlide: true, // GỢI Ý: Chuyển sang true để khi click vào ảnh nhỏ, slider tự cuộn mượt mà
        observer: true,
        resizeObserver: true,
    });

    // B. Khởi tạo Swiper Main
    window.swiperMain = new Swiper(".mySwiper", {
        loop: true,
        loopedSlides: backgrounds.length, // SỬA: Đồng bộ số lượng slide đệm bằng với slide nhỏ
        effect: 'fade',
        speed: 600, 
        autoplay: { 
            delay: 7000, 
            disableOnInteraction: false 
        },
        observer: true,
        resizeObserver: true,
        thumbs: {
            swiper: window.swiperThumb // SỬA: Gọi chính xác biến window.swiperThumb (bỏ chữ s ở cuối)
        },
        on: {
            // Đồng bộ thủ công lớp active để đảm bảo đèn trạng thái luôn sáng đúng ảnh
            slideChange: function () {
                syncThumbActive(this.realIndex);
            }
        }
    });
} // SỬA: Bổ sung dấu ngoặc nhọn quan trọng này để đóng hàm initSwiperSliders!

/* ==========================================================================
    Toggle Button
   ========================================================================== */
const toggleBtn = document.getElementById("thumbToggle");
const thumbSlider = document.querySelector(".mySwiper2");

if (toggleBtn && thumbSlider) { // Kiểm tra phần tử tồn tại để tránh lỗi nếu HTML chưa load xong
    toggleBtn.addEventListener("click", () => {
        thumbSlider.classList.toggle("hidden");
        
        const isHidden = thumbSlider.classList.contains("hidden");
        toggleBtn.textContent = isHidden ? "VIEW" : "HIDE";

        if (!isHidden) {
            requestAnimationFrame(() => {
                if (window.swiperThumb) window.swiperThumb.update();
            });
        }
    });
}

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
