export default class Header {
  constructor({
    header,
    htmlBody,
  }) {
    this.header = header;
    this.htmlBody = htmlBody;
    this.mobileMenu = this.header.find('.mobile-menu');
    this.mobileNav = this.htmlBody.find('.mobile-nav');
    //this.mobileMenuMask = this.htmlBody.find('.mobile-menu-mask');
    this.bindEvents();
  }

  bindEvents = () => {
    const $container = this.htmlBody;
    $container.on('click', '.mobile-menu', this.handleMobileMenu);

    //mobile menu
    if (matchMedia) {
      const mq = window.matchMedia( "(max-width: 991px)" );
      mq.addListener(WidthChange);
      WidthChange(mq);
      // media query change
      function WidthChange(mq) {
        if (mq.matches) {
          //add reponsive class to body to target styling
          $('body').addClass('responsive-mode');
          $(".toggle-menu").on('click',function(e){
            e.preventDefault();
            $(this).toggleClass("on");
            $(".responsive-mode").toggleClass("mobile-menu-active");
            // $('body').toggleClass("active");
            return false;
          });
        } else {
          $('body').removeClass('responsive-mode');
        }
      }
    }
  };

  handleMobileMenu = () => {
    if (this.mobileMenu.hasClass('active')) {
      this.mobileMenu.removeClass('active');
      this.htmlBody.removeClass('active');
      this.mobileNav.removeClass('active');
      //this.mobileMenuMask.removeClass('active');
    } else {
      this.mobileMenu.addClass('active');
      this.htmlBody.addClass('active');
      this.mobileNav.addClass('active');
      //this.mobileMenuMask.addClass('active');
    }
  };
}
