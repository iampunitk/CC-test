export default class VacancyListing {
    constructor() {
        this.init();
        this.bindEvents();
    };

    init = () => {
        this.bindData               = $('#ajax-return');
        this.loaderMore             = $('.load-more-pages');
        this.categoryTab            = $('.category-tab a');
        this.pageType               = '';
    }

    bindEvents = function () {
        this.page = 1;
        this.categoryTab.on('click', this.tabClicked);
        this.loaderMore.on('click', this.nextPage);
    };

    nextPage = (e) => {
        e.preventDefault();
        this.addPage();
        this.showLoader();
        this.loadMore();
    };

    loadMore = () => {
        $.ajax({
            type: "POST",
            dataType: "html",
            url: ajaxurl,
            data: {
                tab: this.getCurrentTabType(),
                page: this.page,
                action: 'vacancy_filters_post_ajax',
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
    };

    tabClicked = (e) => {
        e.preventDefault();
        var input = $(e.currentTarget);
        let page_type = input.data('tab');

        input.parent().siblings().removeClass('active');
        input.parent().addClass('active');

        if(this.pageType !== page_type) {
            this.pageType = page_type;
            this.resetPage();
            this.hideButton();
            this.hideBindData();
            this.filterPages();
        }
    };

    filterPages = () => {
        $.ajax({
            type: "POST",
            dataType: "html",
            url: ajaxurl,
            data: {
                tab: this.getCurrentTabType(),
                page: this.page,
                action: 'vacancy_filters_post_ajax',
            },
            success: this.applyFilters,
        });
    };
    applyFilters = (response) => {
        response = JSON.parse(response);
        if (response.success) {
            this.bindData.empty();
            this.bindData.append(response.data);
        }

        this.checkLoadMore(response.loadMoreValue);
        this.showBindData();
    };

    checkLoadMore = (value) => {
        value ? this.hideButton() : this.showButton();
    };

    hideBindData = () => {
        this.bindData.addClass('d-none');
    };

    showBindData = () => {
        this.bindData.removeClass('d-none');
    };

    hideLoader = () => {
        this.loaderMore.text('Load More');
    };

    showLoader = () => {
        this.loaderMore.text('Please Wait...');
    };

    hideButton = () => {
        this.loaderMore.attr("disabled", true).addClass('d-none');
    };

    showButton = () => {
        this.loaderMore.attr("disabled", false).removeClass('d-none');
    };

    addPage = () => {
        this.page += 1;
    };

    resetPage = () => {
        this.page = 1;
    };

    getCurrentTabType = () => {
        return this.pageType;
    };
}