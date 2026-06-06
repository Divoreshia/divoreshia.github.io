const preloader = document.getElementById("preloader");
const mask = document.getElementById("loader-mask");

/*
    LOADER ANIMATION
    - Logo nằm dưới cùng
    - Mask trắng che phủ từ trái sang phải
    - Khi load tiến triển → mask trượt dần ra bên phải, lộ logo từ trái sang
    - Load xong → preloader fade out

    Thay bằng progress thật của website nếu muốn.
*/

let progress = 0;

const loader = setInterval(() => {

    progress++;

    // Mask thu dần từ trái: translateX tương ứng với % đã load
    // progress 0% → translateX(0%) = che hoàn toàn
    // progress 100% → translateX(100%) = trượt ra ngoài hẳn bên phải
    mask.style.transform = `translateX(${progress}%)`;

if (progress >= 100) {

    clearInterval(loader);

    setTimeout(() => {

        document.querySelector(".logo")
            .classList.add("fade-out");

        setTimeout(() => {

            preloader.classList.add("fade-out");

            setTimeout(() => {
                preloader.remove();
            }, 800);

        }, 800);

    }, 300);
}

}, 20);
