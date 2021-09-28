import lozad from 'lozad';

export default class Search {
    constructor() {
        this.init();
        this.bindEvents();
    }

    init = () => {
        this.page               = 1;
        this.searchBtn          = $('#search-button');
        this.keywords           = $('#search-keywords');
        this.loadMore           = $('.load-more-posts');
        this.bindData           = $("#ajax-return");
        this.clearKeywords      = $('.clear-keywords');
        this.tabItem            = $('.tab-item');
        this.pageType           = '';
    };

    bindEvents = () => {
        this.searchBtn.on('click', this.delayFilter);
        this.keywords.keyup(this.delayFilter);
        this.loadMore.on('click', this.nextPage);
        this.tabItem.on('click', this.tabClicked);
        this.clearKeywords.on('click', this.reset);
    };

    reset = () => {
        this.keywords.removeAttr('value');
        this.delayFilter();
    };

    tabClicked = (e) => {
        var input = $(e.currentTarget);
        let page_type = input.data('tab');

        this.tabItem.each(function () {
            $(this).parent().removeClass("active");
        });
        input.parent().addClass('active');

        this.showLoader();

        if(this.pageType !== page_type) {
            this.pageType = page_type;
            this.resetPage();
            this.showLoader();
            this.filterSearch();
        }
    };

    delayFilter = () => {
        this.resetPage();
        this.showLoader();
        clearInterval(this.timer);
        this.timer = setTimeout(() => {
            this.filterSearch();
        }, 500);
    };

    filterSearch = () => {
        $.ajax({
            type: "POST",
            dataType: "html",
            url: ajaxurl,
            data: {
                keyword: this.getKeywords(),
                type: this.getType(),
                page: this.page,
                action: this.getFilterAction(),
            },
            success: this.applyFilters,
        });
    };
    applyFilters = (response) => {
        response = JSON.parse(response);
        let data;

        if (!response.data) {
            data = `<h4>No matches for your search: ${this.getKeywords()}</h4>`;
        } else {
            data = $(response.data);
        }

        this.bindData.empty();
        this.bindData.append(data);

        $.each(response.count, function (key, val){
            $('#' + key).text('(' + val + ')');
        });

        this.checkLoadMore(response.loadMoreValue);
        this.hideLoader();
        this.lazyLoad();
    };

    nextPage = (e) => {
        e.preventDefault();
        this.addPage();
        this.showLoader();
        this.loadMorePosts();
    };

    loadMorePosts = () => {
        $.ajax({
            type: "POST",
            dataType: "html",
            url: ajaxurl,
            data: {
                keyword: this.getKeywords(),
                type: this.getType(),
                page: this.page,
                action: this.getFilterAction(),
            },
            success: this.appendItems,
        });
    };
    appendItems = (response) => {
        response = JSON.parse(response);
        if (response.success) {
            this.bindData.append(response.data);
        }

        this.checkLoadMore(response.loadMoreValue);
        this.hideLoader();
        this.lazyLoad();
    };

    checkLoadMore = (value) => {
        value ? this.showButton() : this.hideButton();
    };

    showLoader = () =>{
        this.bindData.css('opacity', '0.3');
    };

    hideLoader = () => {
        this.bindData.css('opacity', '');
    };

    hideButton = () => {
        this.loadMore.attr("disabled", true).fadeOut('fast');
    };

    showButton = () => {
        this.loadMore.attr("disabled", false).fadeIn('fast');
    };

    addPage = () => {
        this.page += 1;
    };

    resetPage = () => {
        this.page = 1;
    };

    getKeywords = () => {
        return this.keywords.val() ? encodeURI(this.keywords.val()) : '';
    };

    getType = () => {
        return this.pageType;
    };

    getFilterAction = () => {
        return 'search_filter_ajax';
    }

    lazyLoad = () => {
        const observer = lozad('.lozad', {
            rootMargin: '100px 0px', // syntax similar to that of CSS Margin
            threshold: 0.1, // ratio of element convergence
            enableAutoReload: true // it will reload the new image when validating attributes changes
        });
        observer.observe();
    }
}