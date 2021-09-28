// missing forEach on NodeList for IE11
 // Function to make IE9+ support forEach:
    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }
// core-js v3.x.x:
import "core-js/es";
// import "@babel/polyfill";


// import 'intersection-observer/intersection-observer'

// import Swiper from 'swiper/bundle';
// import gsap from "gsap";
// import GLightbox from "glightbox";
// import 'bootstrap/dist/js/bootstrap.bundle';

// Plugins used
// import "./libs/splitlines/jquery.splitlines";

import 'bootstrap/js/dist/modal.js';

import lozad from 'lozad';
import "select2";
import Sliders from './components/Slider';
import Header from "./components/Header";
import objectFitImages from 'object-fit-images';
import General from './pages/General';
import VacancyListing from './pages/VacancyListing';
import OurOffices from './pages/OurOffices';
import News from './pages/News';
import Search from './pages/Search';
import Awards from './pages/Awards';
import Events from './pages/Events';

export default new (class App {
    constructor() {
        this.setDomMap();
        this.previousScroll = 0;
        // dom ready shorthand
        jQuery(() => {
            this.domReady();
        });
    }

    domReady = () => {
        this.initComponents();
        this.handleUserAgent();
        this.windowResize();
        this.bindEvents();
        this.handleSplashScreen();
        const observer = lozad('.lozad', {
            rootMargin: '100px 0px', // syntax similar to that of CSS Margin
            threshold: 0.1, // ratio of element convergence
            enableAutoReload: true, // it will reload the new image when validating attributes changes
            // load: function(el) {
            //     el.src = el.dataset.src;
            //     el.onload = function() {
            //         el.classList.add('img-fade')
            //     }
            // }
        });
        observer.observe();
        // IntersectionObserver.prototype.POLL_INTERVAL = 100;
        
       var tablet_sm = window.matchMedia("(max-width:991.98px)");
       var tablet_md = window.matchMedia("(min-width:992px)");
       var ipad_pro = window.matchMedia("(max-width:1024.98px)");
       var mobile = window.matchMedia("(max-width:767.98px)");
       var ipad_up = window.matchMedia("(min-width:768px)");
       var ipad_pro_up = window.matchMedia("(min-width:1025px)");

       var navSubWrap = $('#menu-primary > li').find('.sub-menu').length>=1;
       if (navSubWrap){
            $('#menu-primary > li > a + .sub-menu').wrap('<div class="sub-menu-wrapper"></div>');
            $('#menu-primary > li.menu-item-has-children > a').append('<span class="carret"></span>');
            $('small.nav_desc').parent('li').addClass('has-desc');
            $('small.nav_desc').parents('.sub-menu').addClass('description-menus');
            $('.sub-menu .menu-item-has-children').addClass('has-sub');
            $('.has-sub').parents('li').addClass('max-level-3');
       }

            /* if (ipad_pro.matches) {
                 $('#menu-primary > li.menu-item-has-children > a').click(function (e) {
                     e.preventDefault();
                     var hasChildren = $(this).parent('.menu-item-has-children').length == 1;
                     $(this).parent('li').siblings().removeClass('active');
                     $(this).parent('li').toggleClass('active');
                     $(this).parents('li.menu-item').siblings().find('.sub-menu-wrapper').hide();
                     $(this).next('.sub-menu-wrapper').slideToggle();
                     if (hasChildren) {
                         $('body,html').addClass('stop');
                         $('.overlay').show();
                     } else {
                         $('body,html').removeClass('stop');
                         $('.overlay').hide();
                     }
                 });
            } */
            if (tablet_sm.matches) {

                /* Menu toggle */
                $('a.toggle-menu').click(function () {
                    //Added due to Search Toggle
                    $('.global-search').fadeOut(100);
                    $('.navbar-collapse').removeClass('event-none')
                    $('header').removeClass('search-on');
                    $('.overlay').toggle(); //end of search toggle

                    var menuOn = $(this).hasClass('open');
                    if (menuOn){
                        $('.menu-right').addClass('menu-out');
                        $('.menu-right').removeClass('menu-in');
                        $(this).toggleClass('open');

                        setTimeout(function(){
                             $('.menu-right').addClass('d-none');
                             $('.menu-right').removeClass('menu-out');
                        },300);
                        setTimeout(function(){
                             $('.menu-right').removeClass('d-none');
                              $('header').toggleClass('menu-on');
                        },500);
                    }else{
                        $(this).toggleClass('open');
                        $('header').toggleClass('menu-on');
                        $('.menu-right').toggleClass('menu-in');
                    }
                    
                    $('li.menu-item-has-children.active .sub-menu-wrapper').slideUp();
                    $('li.menu-item-has-children').removeClass('active');
                    
                    $('.overlay').toggle();
                    $('body,html').toggleClass('stop');
                });

                /* Drop-down */
                 $('#menu-primary > li .carret').click(function (e) {
                     e.preventDefault();                                                       
                     //var hasChildren = $(this).parent('.menu-item-has-children').length == 1;
                     $(this).parents('li').siblings().removeClass('active');
                     $(this).parents('li').toggleClass('active');
                     $(this).parents('li.menu-item').siblings().find('.sub-menu-wrapper').hide();
                     $(this).parent().next('.sub-menu-wrapper').slideToggle();
                     /* if (hasChildren) {
                         $('body,html').addClass('stop');
                     } else {
                         $('body,html').removeClass('stop');
                     } */
                 });
            }
       var winWidth = function(){
           var DIwidth = $(window).innerWidth();
            $('body,header').css('width', DIwidth + 'px');
       };
       winWidth();

       var resize = function(){
           $(window).resize(function(){
            winWidth();
           });
       };

        resize();
       
       if (ipad_pro_up.matches){
           $('#menu-primary > li > a').on('mouseenter',function (e) {
                e.preventDefault();
                var hasChildren = $(this).parent('.menu-item-has-children').length==1;
                $(this).parent('li').siblings().removeClass('active');
                $(this).parent('li.menu-item-has-children').addClass('active');
                // $(this).parents('li.menu-item').siblings().find('.sub-menu-wrapper').css('opacity','0');
                // $(this).next('.sub-menu-wrapper').css('opacity','1');
                if (hasChildren) {
                   $('body,html').addClass('stop');
                   $('header').addClass('menu-on');
                //    $(this).next('.sub-menu-wrapper').css({opacity : 1, visibility:});

                   $('.overlay').show();
                }else{
                    $('body,html').removeClass('stop');
                    $('header').removeClass('menu-on');
                    $('.overlay').hide();
                }
           });

           $('.sub-menu-wrapper').mouseleave(function(){
                $('header').removeClass('menu-on').delay(600);
                // $('.sub-menu-wrapper').css('opacity','0');
                $('body,html').removeClass('stop');
                $('.overlay').hide();
           });

           $(document).mouseup(function (e) {
               var menu_open = $('.sub-menu-wrapper,li.menu-item-has-children.active,.global-search,.header-top');
               if (!menu_open.is(e.target) && menu_open.has(e.target).length === 0) {
                //    $('li.menu-item-has-children.active .sub-menu-wrapper').fadeOut();
                   $('li.menu-item-has-children').removeClass('active');
                   $('body,html').removeClass('stop');
                    $('header').removeClass('menu-on').delay(600);
                   $('.overlay').hide();
                    
                   /* Added due to search */ 
                   $('.global-search').fadeOut(100);
                   $('.navbar-collapse').removeClass('event-none')
                   $('header').removeClass('search-on');
                   
               }
           });
       }

       /* Search Toggle */
       $('header .header-search').click(function () {
           var checkClass = $('body').not('.search').length==1;
           if(checkClass){
               $('header').toggleClass('search-on');
               $('.navbar-collapse').toggleClass('event-none')
               $('.global-search').fadeToggle(100);
               $('body,html').addClass('stop');
               $('.overlay').show();
           }else{
              $('.global-search').slideToggle();
           }

           var menuOn = $('.toggle-menu').hasClass('open');
           if (menuOn) {
               $('.menu-right').addClass('menu-out');
               $('.menu-right').removeClass('menu-in');
               $('.toggle-menu').removeClass('open');

               setTimeout(function () {
                   $('.menu-right').addClass('d-none');
                   $('.menu-right').removeClass('menu-out');
               }, 300);
               setTimeout(function () {
                   $('.menu-right').removeClass('d-none');
                   $('header').toggleClass('menu-on');
               }, 500);
           }
       });

       $('.close-search').click(function(){
           $('header').removeClass('search-on');
           $('.navbar-collapse').removeClass('event-none')
           $('.global-search').fadeOut(100);
           $('body,html').removeClass('stop');
           $('.overlay').hide();
       });

       /* Forms --- Adding custom checkbox */
       $(".comm-content .wpcf7 input[type=checkbox]").after('<span class="checkbox"></span>');
       /* Done for vacancy form  */
       $('#vacancy-form input[type=file]').change(function () {
            var filename = $('input[type=file]').val().replace(/C:\\fakepath\\/i, '');
            $('.field-wrapper').find('.file-name').text(filename);
            $('.field-wrapper').find('.icon-close').removeClass('d-none');
       });
       $('#vacancy-form .icon-close').click(function () {
            $('.field-wrapper').find('.icon-close').addClass('d-none');
            $('#vacancy-form input[type=file]').val('');
            $('span.file-name').text('');
       });

       /* General Accordion */
       $('.accordion-list .title').click(function(){    
            $(this).parent('li').toggleClass('active');
            $(this).next().slideToggle();
            $(this).parent().siblings().find('.comm-content').slideUp();
            $(this).parent().siblings().removeClass('active');

            /* Only Used for two column accordion */
            $(this).parents('.two-col-accordion .c-mod').next().find('.active').children('.comm-content').slideUp();
            $(this).parents('.two-col-accordion .c-mod').next().find('li').removeClass('active');
            $(this).parents('.two-col-accordion .c-mod').prev().find('.active').children('.comm-content').slideUp();
            $(this).parents('.two-col-accordion .c-mod').prev().find('li').removeClass('active');
        });

       /* Accordion with Tabs */
       $('.accordion-tab a').click(function(e){
            e.preventDefault();
            $(this).parent().addClass('active');
            $(this).parent().siblings().removeClass('active');
            var attribute = $(this).attr('href');
            $('.accordion-with-tabs').find('.active-container').removeClass();
            $('.accordion-with-tabs').find(attribute).fadeIn(500);
            $(attribute).siblings('div').fadeOut(500);
       });

       $('.accordion-with-tabs li .title').click(function(){
            $(this).parent().toggleClass('active');
            $(this).next().slideToggle();
            $(this).parent().siblings().find('.comm-content').slideUp();
            $(this).parent().siblings().removeClass('active');
       });

       /* Vacancy Category Tabs filter */
        $(window).resize(function(){
            $('.filter + ul').attr('style','');
        });

       $('.category-tab a').click(function (e) {
            e.preventDefault();
            var text = $(this).text();
            $('.category-tab .filter').text(text);

            if(mobile.matches){
                $(this).parents('ul').slideUp();
                $('.filter').removeClass('open');
            }
       });

       $('.category-tab .filter').click(function(){
           $(this).toggleClass('open');
           $(this).next().slideToggle();
       });

       /* Share Article */
       $('#copy-url').click(function() {
            var copy_link = $('.page-url');
            copy_link.select();
            document.execCommand("copy");
       });

    };


    initComponents = () => {
        objectFitImages();

        new Header({
            header: this.header,
            htmlBody: this.htmlBody,
        });
        new Sliders();
        // new boostrapJs();

        this.selectInput.select2({
            minimumResultsForSearch: Infinity,
            width: '100%' 
            // closeOnSelect: false,
        });

      
    };
    setDomMap = () => {
        this.window = jQuery(window);
        this.htmlNbody = jQuery('body, html');
        this.html = jQuery('html');
        this.htmlBody = jQuery('body');
        this.siteLoader = $('.site-loader');
        this.header = $('header');
        this.siteBody = $('.site-body'); 
        this.selectInput = $('select');
        this.inputs = $('input, textarea').not('input[type="submit"],input[type="checkbox"]');
    };
    bindEvents = () => {
        // Window Events
        this.window.resize(this.windowResize).scroll(this.windowScroll);

        this.inputs
            .on({
                focus: e => {
                    const self = $(e.currentTarget);
                    self.closest('.field-wrapper').addClass('active');
                },
                blur: e => {
                    const self = $(e.currentTarget);
                    if (self.val() !== '') {
                        self.closest('.field-wrapper').addClass('active');
                    } else {
                        self.closest('.field-wrapper').removeClass('active');
                    }
                },
            })
            .trigger('blur');

            $(".search-link").click(function(){
                $(".search-form").toggleClass("active");
            });
    };



    windowResize = () => {
        this.screenWidth = this.window.width();
        this.screenHeight = this.window.height();

        // calculate footer height and assign it to wrapper and push/footer div
        // if (this.pushDiv.length) {
        //     this.footerHeight = this.footer.outerHeight();
        //     this.wrapper.css('margin-bottom', -this.footerHeight);
        //     this.pushDiv.height(this.footerHeight);
        // }
    };
    windowScroll = () => {
        const topOffset = this.window.scrollTop();
        //console.log(topOffset);
        this.header.toggleClass('top', topOffset > 300);
        this.header.toggleClass('sticky', topOffset > 600);

        if (topOffset > this.previousScroll || topOffset < 500) {
            this.header.removeClass('sticky');
        } else if (topOffset < this.previousScroll) {
            this.header.addClass('sticky');
            // Additional checking so the header will not flicker
            if (topOffset > 250) {
                this.header.addClass('sticky');
            } else {
                this.header.removeClass('sticky');
            }
        }


        /* if (topOffset > 150){
            $('header').removeClass('start');
            $('header').addClass('top');
            setTimeout(() => {
                $('header').addClass('slide-down');
            }, 500);
        }else{
            setTimeout(() => {
               $('header').delay(1000).removeClass('slide-down');
            }, 500);
            
            $('header').removeClass('top');
             $('header').delay(1000).addClass('start');
        } */

        this.previousScroll = topOffset;
        // this.gotoTop.toggleClass(
        //     'active',
        //     this.window.scrollTop() > this.screenHeight / 2,
        // );
    };
    handleSplashScreen() {
        // alert('triggered');
        this.htmlBody.find('.logo-middle').fadeIn(500);
        this.siteLoader.delay(1500).fadeOut(500);
    }
    handleUserAgent = () => {
        // detect mobile platform
        if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
            this.htmlBody.addClass('ios-device');
        }
        if (navigator.userAgent.match(/Android/i)) {
            this.htmlBody.addClass('android-device');
        }

        // detect desktop platform
        if (navigator.appVersion.indexOf('Win') !== -1) {
            this.htmlBody.addClass('win-os');
        }
        if (navigator.appVersion.indexOf('Mac') !== -1) {
            this.htmlBody.addClass('mac-os');
        }

        // detect IE 10 and 11P
        if (
            navigator.userAgent.indexOf('MSIE') !== -1 ||
            navigator.appVersion.indexOf('Trident/') > -1
        ) {
            this.html.addClass('ie10');
        }

        // detect IE Edge
        if (/Edge\/\d./i.test(navigator.userAgent)) {
            this.html.addClass('ieEdge');
        }

        // Specifically for IE8 (for replacing svg with png images)
        if (this.html.hasClass('ie8')) {
            const imgPath = '/themes/theedge/images/';
            jQuery('header .logo a img,.loading-screen img').attr(
                'src',
                `jQuery{imgPath}logo.png`,
            );
        }

        // show ie overlay popup for incompatible browser
        if (this.html.hasClass('ie10')) {
            const message = jQuery(
                '<div class="no-support"> You are using outdated browser. Please <a href="https://browsehappy.com/" target="_blank">update</a> your browser or <a href="https://browsehappy.com/" target="_blank">install</a> modern browser like Google Chrome or Firefox.<div>',
            );
            this.htmlBody.prepend(message);
        }
    };



})();
