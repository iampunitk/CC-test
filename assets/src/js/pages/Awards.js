export default class Awards {
    constructor() {
        this.init();
        this.bindEvents();
    };

    init = () => {
        this.bindData               = $('#ajax-return');
        this.keywords               = $('#keywords');
        this.searchBtn              = $('#search-button');
        this.loaderMore             = $('.load-more-pages');
        this.yearTab                = $('#year-tab');
        this.sortBy                 = $('#sort-by');
        this.pageType               = '';
    }

    bindEvents = function () {
        this.page = 1;
        this.keywords.keyup(this.delayFilter);
        this.searchBtn.on('click', this.delayFilter);
        this.yearTab.on('change', this.delayFilter);
        this.sortBy.on('change', this.delayFilter);
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
                keyword: this.getKeywords(),
                year: this.getYear(),
                sortBy: this.getSortBy(),
                page: this.page,
                action: 'awards_filters_post_ajax',
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

    delayFilter = () => {
        this.resetPage();
        this.hideBindData();
        clearInterval(this.timer);
        this.timer = setTimeout(() => {
            this.filterPages();
        }, 500);
    };

    filterPages = () => {
        $.ajax({
            type: "POST",
            dataType: "html",
            url: ajaxurl,
            data: {
                keyword: this.getKeywords(),
                year: this.getYear(),
                sortBy: this.getSortBy(),
                page: this.page,
                action: 'awards_filters_post_ajax',
            },
            success: this.applyFilters,
        });
    };
    applyFilters = (response) => {
        response = JSON.parse(response);
        let data;

        if (response.success) {
            data = response.data;
        } else {
            data = `<p>No results found</p>`;
        }

        this.bindData.empty();
        this.bindData.append(data);

        this.checkLoadMore(response.loadMoreValue);
        this.showBindData();
    };

    checkLoadMore = (value) => {
        value ? this.showButton() : this.hideButton();
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

    getKeywords = () => {
        return this.keywords.val() ? encodeURI(this.keywords.val()) : '';
    };

    getYear = () => {
        return this.yearTab.val() ? encodeURI(this.yearTab.val()) : '';
    };

    getSortBy = () => {
        return this.sortBy.val() ? encodeURI(this.sortBy.val()) : '';
    };
}