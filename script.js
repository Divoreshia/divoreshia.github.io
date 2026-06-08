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
   3. INITIALIZE SWIPER (ĐỒNG BỘ NATIVE FADE - CHỐNG LỖI LOẠN TUYỆT ĐỐI)
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
    // A. Khởi tạo Swiper Thumbnail (Thanh nhỏ hiển thị danh sách bên dưới)
    window.swiperThumb = new Swiper(".mySwiper2", {
        loop: true,
		loopedSlides: backgrounds.length*3,
        spaceBetween: 16,
        slidesPerView: 5,           
        centeredSlides: true,
        watchSlidesProgress: true,
        slideToClickedSlide: false,
        observer: true,
        resizeObserver: true,
    });


// B. Khởi tạo Swiper Main (Khung ảnh lớn hiển thị bên trên)
	window.swiperMain = new Swiper(".mySwiper", {
		loop: true,
		loopedSlides: backgrounds.length*3,
		effect: 'fade',
		speed: 600, 
		autoplay: { 
			delay: 7000, 
			disableOnInteraction: false 
		},
		observer: true,
		resizeObserver: true,
		on: {
			init: function () {
				this.slides.forEach((slide) => {
					// 🛠️ SỬA TẠI ĐÂY: Thay .main-slider-img bằng .swiper-image-main
					const img = slide.querySelector(".swiper-image-main"); 
					if (!img) return;
                
					if (slide.classList.contains("swiper-slide-active")) {
						slide.style.zIndex = "3";
						img.style.opacity = "1";
					} else {
						slide.style.zIndex = "1";
						img.style.opacity = "0";
					}
				});
			},
        
			slideChangeTransitionStart: function () {
				this.slides.forEach((slide) => {
					// 🛠️ SỬA TẠI ĐÂY THỨ HAI: Thay .main-slider-img bằng .swiper-image-main
					const img = slide.querySelector(".swiper-image-main");
					if (!img) return;

					const isActive = slide.classList.contains("swiper-slide-active");
					const currentOpacity = parseFloat(img.style.opacity) || 0;

					if (isActive) {
						slide.style.zIndex = "2"; 
						img.style.transition = "none"; 
						img.style.opacity = "1";
					} 
					else if (currentOpacity > 0) {
						slide.style.zIndex = "3"; 
						void img.offsetWidth; 
						img.style.transition = "opacity 600ms ease"; 
						img.style.opacity = "0";
					} 
					else {
						slide.style.zIndex = "1";
						img.style.opacity = "0";
						img.style.transition = "none";
					}
				});
			},

			slideChangeTransitionEnd: function () {
				this.slides.forEach((slide) => {
					if (slide.classList.contains("swiper-slide-active")) {
						slide.style.zIndex = "3";
					} else {
						slide.style.zIndex = "1";
					}
				});
			}
		}
	});


    // Kích hoạt sáng đèn ô Thumbnail tương ứng với ảnh đầu tiên ngay khi tải trang
    syncThumbActive(window.swiperMain.realIndex);

    // C. LUỒNG 1: XỬ LÝ KHI NGƯỜI DÙNG CLICK VÀO THUMBNAIL (Thanh nhỏ)
    window.swiperThumb.on('click', function (swiper) {
        const clickedSlide = swiper.clickedSlide;
        if (!clickedSlide) return;

        const targetIndex = parseInt(clickedSlide.dataset.swiperSlideIndex);
        
        if (!isNaN(targetIndex)) {
            // Nếu người dùng click trúng ngay ảnh đang hiển thị thì dừng, không xử lý lại
            if (targetIndex === window.swiperMain.realIndex) return;

            // 1. Tạm dừng autoplay của Main để tránh xung đột lệnh chạy tự động trong lúc click
            window.swiperMain.autoplay.stop();

            // 2. Điều hướng ảnh Main nhảy trực tiếp đến ảnh được chọn bằng hiệu ứng Fade gốc cực đẹp
			
            window.swiperMain.slideToLoop(targetIndex, 1000);

            window.swiperThumb.slideToLoop(targetIndex, 1000);

            // 4. Đổi đèn trạng thái active lập tức trên giao diện để tạo cảm giác phản hồi nhanh
            syncThumbActive(targetIndex);

            // 5. Kích hoạt lại Autoplay để tiếp tục đếm ngược vòng lặp tự động chạy 7 giây
            window.swiperMain.autoplay.start();
        }
    });

    // D. LUỒNG 2: XỬ LÝ KHI MAIN TỰ ĐỘNG ĐỔI ẢNH (Do Autoplay chạy hoặc do người dùng vuốt tay trên màn hình)
    window.swiperMain.on('slideChange', function () {
        const currentRealIndex = window.swiperMain.realIndex;

        if (window.swiperThumb && window.swiperThumb.realIndex !== currentRealIndex) {
            window.swiperThumb.slideToLoop(currentRealIndex, 300);
        }
        syncThumbActive(currentRealIndex);
    });
}

/* ==========================================================================
	Toggle Button
   ========================================================================== */
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