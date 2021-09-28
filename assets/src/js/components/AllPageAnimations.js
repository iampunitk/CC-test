$.fn.isInViewport = function (offset) {
  var offst = offset ? offset : 100;
  var elementTop = $(this).offset().top + offst;
  var elementBottom = elementTop + $(this).outerHeight();

  var viewportTop = $(window).scrollTop();
  var viewportBottom = viewportTop + $(window).height();

  return elementBottom > viewportTop && elementTop < viewportBottom;
};

import { gsap } from "gsap";
import { TimelineMax , Power2, Power3, Circ, Expo} from "gsap/all"; 
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import "../libs/splitlines/jquery.splitlines";

export default class AllPageAnimations {
    constructor() {
      
      this.setDomMap();

      this.bindEvents();
  
    }
    setDomMap = () => {

      this.window = $(window);
      this.container = $("body");
      this.main = $("main");
      this.siteLoader = $(".site-loader");
      this.header = this.container.find(".header");
      this.sliderBanner = $(".slider-banner");
      this.normalBanner = $('.banner-two');
      this.bannerContentWrapper = $('.banner-content-animation');
      
      if(this.normalBanner.length){
        this.normalBanner.addClass('banner-content-animation');
        this.bannerContentWrapper = $('.banner-content-animation');
      }

      this.maskBanner = $('.mask-banner');
    };
    bindEvents = () => {

      // scroll window Event
      this.window.scroll(this.windowScroll);

      

      //slider banner headings split
      if (this.sliderBanner.find(".banner__content h1").length) {
        this.sliderBanner.find(".banner__content h1").splitLines({
            tag: '<div class="heading_line"><span class="split-line">',
            keepHtml: true,
        });
        this.sliderBanner.find(".banner__content h1").css('opacity','1');
      }

      if (this.sliderBanner.find(".banner__content h2").length) {
        this.sliderBanner.find(".banner__content h2").each(function(){
          $(this).splitLines({
            tag: '<div class="heading_line"><span class="split-line">',
            keepHtml: true,
          });
        });
      }

      //normal banner headings
      
      if (this.bannerContentWrapper.find("h1").length) {
        this.bannerContentWrapper.find("h1").splitLines({
            tag: '<div class="heading_line"><span class="split-line">',
            keepHtml: true,
        });
        this.bannerContentWrapper.find("h1").css('opacity','1');
      }
      

      //section title
      if($('.title-button-wrap h2').length){
        $(".title-button-wrap h2,.overview-content h2, .intro h2").each(function (index, item) {
          $(item).splitLines({
            tag: '<div class="heading_line"><span class="split-line">',
            keepHtml: true,
            width: 500,
          });
        });
      }



      const tl = new TimelineMax();

      setTimeout(() => {
        this.siteLoader.fadeOut(500);
        
        //fade in blur backround on load
        if($('.slider-banner .blur-background').length){
          tl.staggerFromTo(
            this.sliderBanner.find('.blur-background'),
              2,
              { scaleX:1.7, scaleY:1.7, transformOrigin:"center"},
              { scaleX:1.5, scaleY:1.5, transformOrigin:"center", ease: Power3.easeOut },
              0
          );
        }

        // header animation onload
        tl.staggerFromTo(
            this.header,
            0.5,
            { y: -10, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, ease: Power3.easeOut },
            "-=1"
        );

        //banner having slider
        let slideheadingLines = this.sliderBanner.find('.swiper-slide-active .banner__content .heading_line .split-line');
        if (slideheadingLines.length) {
          tl.staggerFromTo(
            slideheadingLines,
            1.5,
            { alpha: 0, y: 30 },
            { alpha: 1 , y:0, ease: Power3.easeOut },
            0.3
          )
          .fromTo(
            '.home-banner-slider1 .swiper-slide-active .banner__content .button-wrap .button',
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1 , y:0, ease: Power3.easeOut, duration: 0.01},
            "-=1"
          );
        }


        // Normal Banner 

        //banner breadcrumb
        let pagebreadcrumbs = this.bannerContentWrapper.find("#breadcrumbs");
        if (pagebreadcrumbs.length) {
          tl.fromTo(
            pagebreadcrumbs,
            0.9,
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, ease: Power3.easeOut},
            0.1
          )
        }

        // banner title 
        let pageBannerTitle = this.bannerContentWrapper.find('.heading_line .split-line');
        let pageHeaderTag = this.bannerContentWrapper.find('h1');
        let subHead = this.bannerContentWrapper.find('.sub,.h6');
        let backBtn = this.bannerContentWrapper.find('.back-btn');
        let bannerBtn = this.bannerContentWrapper.find('.button');

        let overviewContent = $('.overview-wrapper .overview-content');

        

        if (pageBannerTitle.length) {
            tl.set(pageBannerTitle,{y:30, alpha: 0});
            if(pageHeaderTag){
              tl.set(pageHeaderTag,{alpha: 1});
            }
            tl.staggerTo(pageBannerTitle, 1, {y:0, alpha: 1 , ease: Power3.easeOut},  0.03);
        }
        if(overviewContent.length){
          tl.fromTo(
            overviewContent,
            0.3,
            { autoAlpha: 0, y:30, ease: Power3.easeOut},
            { autoAlpha: 1, y:0, ease: Power3.easeOut},
          );
        }
        if(subHead.length){
            tl.set(subHead,{y:10, alpha: 0});
            tl.fromTo(
              subHead,
              0.5,
              { autoAlpha: 0, y: 10 },
              { autoAlpha: 1, y: 0, ease: Power3.easeOut, duration: 0.01},
            )
        }
        
        if(bannerBtn.length){
          tl.set(bannerBtn,{y:10, alpha: 0});
          tl.fromTo(
            backBtn,
            0.3,
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, ease: Power3.easeOut, duration: 0.02},
            "-=1"
          )
        }
        if(backBtn.length){
          tl.set(backBtn,{y:10, alpha: 0});
          tl.fromTo(
            backBtn,
            0.3,
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, ease: Power3.easeOut, duration: 0.02},
          )
        }

        // paragraphs
        if(this.bannerContentWrapper.find('p').length){
          tl.staggerFromTo(
            this.bannerContentWrapper.find('p, .description').not("#breadcrumbs"),
            1.5,
            { autoAlpha: 0 },
            { autoAlpha: 1 , ease: Power3.easeOut},
            0.01
          );
        }

        // buttons
        if(this.bannerContentWrapper.find('.button').length){
          tl.staggerFromTo(
            this.bannerContentWrapper.find('.button'),
            1,
            { autoAlpha: 0 },
            { autoAlpha: 1 , ease: Power3.easeOut},
            0.1
          );
        }
        
        if($('.page-nav-container').length){
          tl.fromTo(
            $('.page-nav-container'),
            0.3,
            { autoAlpha: 0,y: 30},
            { autoAlpha: 1, y:0, ease: Power3.easeOut},
          );
        }

        
       
        //vector background parallax on service slide
        if($('.services_slider__col').length){
          let serviceVector = $('.services_slider__col .vector-bg');
          let el = $('.services_slider_container');
          if($(window).width()>1024){
            $('.services_slider__col').on('mousemove', this.vectorParallax);
          }
        }

        if($('.service-banner').length){
          let serviceVector = $('.service-banner .vector-bg');
          let el = $('.services_slider_container');
          if($(window).width()>1024){
            $('.service-banner').on('mousemove', this.vectorParallax);
          }
        }

      }, 600);

      //mask parallax effect on mouse movemnt
      if($(window).width()>1024){
        this.mouseMoveParallax();
      }



      //fade up animation
      if($(".fade-up").length){
        $(".fade-up").each((index, item)=>{
          let el = $(item)[0];
          const tl = gsap.timeline({
          scrollTrigger: {
              trigger: el,
              // scroller: ".scroll-section",
              start: "top 85%", // when the top of the trigger hits the top of the viewport
          }});
          tl.set(el, {
              autoAlpha:0,
              y: 0,
          })
          .staggerFromTo(
              el,
              2,
              { autoAlpha: 0, y: 50},
              { y: 0, autoAlpha: 1, ease: Power3.easeOut},
              0.01,
          )
        });
      }

      if($("h2").length){
        $(".intro h2 .split-line,.title-button-wrap h2 .split-line, .overview-content h2 .split-line").each((index, item)=>{
            let el = $(item);
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: el,
                    // scroller: ".scroll-section",
                    start: "top 90%", // when the top of the trigger hits the top of the viewport
                }});

            tl.set(el, {
                autoAlpha:0,
                y: 30
            })
            .staggerFromTo(
              el,
              1,
              { autoAlpha: 0, y: 30 },
              { autoAlpha: 1, y: 0, ease: Power3.easeOut},
              0.03
            )
        })
      }

    };
    vectorParallax = (e) => {
        let elem = $(e.target).siblings( ".vector-bg" );
        let _w = window.innerWidth/5;
        let _h = window.innerHeight/5;
        var mouseX = e.clientX / _w;
        var mouseY = e.clientY / _h;

        var scale="scale(1.1)";
        var translate='translate3d(-' + mouseX + '%, -' + mouseY + '%, 0)';
        var prop=scale+" "+translate;
        elem.css('transform',prop);
    }

    mouseMoveParallax = () =>{
        if($(window).width()>1024 && $('.banner .banner__mask_wrapper').length){
            let mouseArea = $('.mask-mouse-area');
            mouseArea.mousemove(this.parallax);
        }
    };
    parallax = (e) => {
        let elem = $('.mask-mouse-area .banner__mask_wrapper .banner__slide__img');
        let _w = window.innerWidth/5;
        let _h = window.innerHeight/5;
        var mouseX = e.clientX / _w;
        var mouseY = e.clientY / _h;

        var scale="scale(1.1)";
        var translate='translate3d(-' + mouseX + '%, -' + mouseY + '%, 0)';
        var prop=scale+" "+translate;
        elem.css('transform',prop);
    }


    
  
    windowScroll = () => {

      // stats block counter
      let $el = $('.stats-block-numbers .counter,.statistics .counter');
      if (this.checkViewport($el)) {
         $el.each(function () {
          var $this = $(this),
            countTo = $this.attr('data-count');
          $({ countNum: $this.text()}).animate({
            countNum: countTo
          },
          {
            duration: 1000,
            easing:'linear',
            step: function() {
              $this.text(Math.floor(this.countNum));
            },
            complete: function() {
              $this.text(this.countNum);
              //alert('finished');
            }
          });
        });
      }
    };
  
   
    
  
    init = () => {
      this.genericSlideUpAnimation(this.$statsSection, ".intro-block");
      this.genericSlideUpAnimation(this.$trustedbySection, "h2");
      // this.cardParallax(this.$servicesCard);
    };
  
    checkViewport = ($el, offset) => {
      return (
        $el && $el.length && $el.isInViewport(offset) && !$el.hasClass("animated")
      );
    };

    cardParallax = () => {
      let divs = $(".services-card");
      console.log(divs);
      let count = null;
      // if($(window).width() <= 991){
      //     count = 2
      // } else {
      //     count = 3
      // }
      // for(var i = 0; i < divs.length; i+=count) {
      //     divs.slice(i, i+count).wrapAll("<div class='row'></div>");
      // }
    };
}