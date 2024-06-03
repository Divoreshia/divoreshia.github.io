var swiper = new Swiper(".mySwiper", {
    spaceBetween: 30,
    loop: "true",
    effect: "fade",
    fadeEffect: {crossfade:false},
    speed: 1000,
    delay: 2000,
    autoplay: {enable: true, delay: 7000, disableOnInteraction: false},
    }
  );



//Intro
  
  $(document).ready(function() {
    // Hiển thị GIF khi trang được tải xong
    $("#intro").show();

    // Ẩn GIF sau 3 giây (3000 milliseconds)
    setTimeout(function() {
        $("#intro").fadeOut("slow");
    }, 2700);
});

//Code trộm từ simsimi (và simsimi trộm từ của ai đó) 
//bring to top

$(document).ready(function(){
  $("button").click(function(){
      $("div").animate({left: '250px'});
  });
  $("#gototop").hide();
  $(window).scroll(function(){
      if($(this).scrollTop()>=100){
          $("#gototop").show(1000);
      }
      else{
          $("#gototop").hide();
      }
      $("#gototop").click(function(){
          document.documentElement.scrollTop = 0;
      });
  })
});