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
   3. INITIALIZE SWIPER (ĐỒNG BỘ NÂNG CAO - SỬA LỖI ACTIVE & FADE)
   ========================================================================== */
window.swiperThumb = null;
window.swiperMain = null;

// Hàm thủ công cập nhật class Active cho Thumbnail (Sửa lỗi mất class CSS Active)
function updateManualThumbActive(realIndex) {
    // 1. Xóa class active ở TẤT CẢ các ô thumb hiện tại
    document.querySelectorAll('.mySwiper2 .swiper-slide').forEach(slide => {
        slide.classList.remove('swiper-slide-thumb-active');
    });

    // 2. Thêm class active vào ĐÚNG các ô có realIndex (Tìm cả các ô sao chép do loop:true)
    const activeSlides = document.querySelectorAll(`.mySwiper2 .swiper-slide[data-swiper-slide-index="${realIndex}"]`);
    activeSlides.forEach(slide => {
        slide.classList.add('swiper-slide-thumb-active');
    });
}

function initSwiperSliders() {
    // A. Khởi tạo thanh Thumb nhỏ độc lập
    window.swiperThumb = new Swiper(".mySwiper2", {
        loop: true,
        centeredSlides: true,
        watchSlidesProgress: true,
        spaceBetween: 16,
        slidesPerView: 5,           
        slideToClickedSlide: false, // Tắt mặc định để xử lý bằng logic click mượt hơn bên dưới
        observer: true,
        resizeObserver: true,
    });

    // B. Khởi tạo Main lớn độc lập
    window.swiperMain = new Swiper(".mySwiper", {
        loop: true,
        speed: 1200,
        autoplay: { delay: 7000, disableOnInteraction: false },
        effect: "fade",
        fadeEffect: { 
            crossFade: false // Đổi thành FALSE: Ảnh cũ giữ nguyên, ảnh mới fade-in đè lên trên (Không lộ nền)
        },
    });

    // Cập nhật class Active lần đầu tiên khi vừa tải trang xong
    updateManualThumbActive(0);

    // Cờ bảo vệ chống lặp vô hạn sự kiện (Event Loop)
    let isSyncing = false;

    // HƯỚNG 1: Khi CLICK vào thanh Thumb nhỏ -> Đổi ảnh Main lớn tức thời
    window.swiperThumb.on('click', function (swiper) {
        if (isSyncing) return;

        const clickedSlide = swiper.clickedSlide;
        if (!clickedSlide) return;

        const targetIndex = clickedSlide.dataset.swiperSlideIndex;
        
        if (targetIndex !== undefined && targetIndex !== null) {
            const realIdx = parseInt(targetIndex);
            
            isSyncing = true; // Khóa hướng ngược lại

            // Main lớn nhảy lập tức sang ảnh mới (speed = 0) để không lộ các ảnh ở giữa
            window.swiperMain.slideToLoop(realIdx, 700);

            // Thanh thumb nhỏ cuộn mượt mà vào giữa tâm
            window.swiperThumb.slideToLoop(realIdx, 700);

            // Kích hoạt sáng đèn CSS Active cho ô được chọn
            updateManualThumbActive(realIdx);

            setTimeout(() => { isSyncing = false; }, 50);
        }
    });

    // HƯỚNG 2: Khi SLIDE BẰNG MAIN (Vuốt tay HOẶC Tự động Autoplay) -> Thumbnail chạy theo mượt mà
    window.swiperMain.on('slideChange', function () {
        if (isSyncing) return; 

        isSyncing = true;
        const currentRealIndex = window.swiperMain.realIndex;

        if (window.swiperThumb) {
            // Ép thanh thumb nhỏ trượt theo vị trí mới của Main vào giữa tâm
            window.swiperThumb.slideToLoop(currentRealIndex, 300);
        }

        // Cập nhật sáng đèn CSS Active đồng bộ theo ảnh Main to đang hiển thị
        updateManualThumbActive(currentRealIndex);

        setTimeout(() => { isSyncing = false; }, 50);
    });
}


// Toggle Button

const toggleBtn = document.getElementById("thumbToggle");
const thumbSlider = document.querySelector(".mySwiper2");

toggleBtn.addEventListener("click", () => {
    // Chỉ cần thêm/xóa class .hidden
    thumbSlider.classList.toggle("hidden");
    

    const isHidden = thumbSlider.classList.contains("hidden");
    toggleBtn.textContent = isHidden ? "VIEW" : "HIDE";

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