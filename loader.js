const reveal = document.getElementById("reveal");
const blackLogo = document.querySelector(".logo-black");
const preloader = document.getElementById("preloader");

/*
    DEMO PROGRESS

    Thay bằng progress thật của website
    nếu muốn.
*/

let progress = 0;

const loader = setInterval(() => {

    progress++;

    reveal.style.width = progress + "%";

    if (progress >= 100) {

        clearInterval(loader);

        // Giữ logo đen 0.2s
        setTimeout(() => {

            // Chữ đen -> trắng trong 1s
            blackLogo.classList.add("to-white");

            // Chờ xong hiệu ứng trên
            setTimeout(() => {

                // Nền trắng fade đi trong 1s
                preloader.classList.add("fade-out");

                setTimeout(() => {

                    preloader.remove();

                }, 1000);

            }, 1000);

        }, 200);

    }

}, 25);
