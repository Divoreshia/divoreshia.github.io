const preloader = document.getElementById("preloader");
const logoMask = document.querySelector(".logo-mask");
const blackLogo = document.querySelector(".logo-black");

/**
 * Update tiến độ hiển thị
 * value = 0 -> 100
 */
function setProgress(value) {
    logoMask.style.width = `${value}%`;
}

/**
 * Demo tiến độ load
 * Thực tế bạn thay bằng progress thật
 */
let progress = 0;

const fakeLoading = setInterval(() => {

    progress += Math.random() * 8;

    if (progress >= 100) {
        progress = 100;
    }

    setProgress(progress);

    if (progress === 100) {

        clearInterval(fakeLoading);

        // Bước 1:
        // Chữ đen -> trắng trong 1s

        setTimeout(() => {

            blackLogo.classList.add("fade-white");

            // Bước 2:
            // nền trắng fade đi trong 1s

            setTimeout(() => {

                preloader.classList.add("hide");

                setTimeout(() => {
                    preloader.remove();
                }, 1000);

            }, 1000);

        }, 200);

    }

}, 100);
