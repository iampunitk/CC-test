export default class Sliders {
    constructor() {

        this.setDomMap();
        this.initClassesSlider();
    }
    setDomMap = () => {
        this.$window = $(window);
        this.$document = $(document);
    }
   
    initClassesSlider = () => {
        let slideIndex = 1;
        showSlides(slideIndex);
        document.getElementById("slide-next").addEventListener("click", function() {
           plusSlides(1);
        });

        document.getElementById("slide-prev").addEventListener("click", function() {
           plusSlides(-1);
        });

        function  plusSlides (n) {
            showSlides(slideIndex += n);
        }
        function currentSlide (n){
            showSlides(slideIndex = n);
        }

        function showSlides(n) {
            var i;
            var slides = document.getElementsByClassName("slide");
            // var dots = document.getElementsByClassName("dot");
            if (n > slides.length) {slideIndex = 1}    
            if (n < 1) {slideIndex = slides.length}
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";  
                slides[slideIndex-1].style.opacity = 0;  

            }
            // for (i = 0; i < dots.length; i++) {
            //     dots[i].className = dots[i].className.replace(" active", "");
            // }
            slides[slideIndex-1].style.display = "block";  
            slides[slideIndex-1].style.opacity = 1;  

            // dots[slideIndex-1].className += " active";
        }
    }
   

    



   
}