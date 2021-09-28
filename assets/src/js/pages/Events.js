import lozad from "lozad";

export default class Events {
    constructor() {
        this.init();
        this.bindEvents();
    };

    init = () => {
        this.bindData               = $('#ajax-return');
        this.keywords               = $('#keywords');
        this.searchBtn              = $('#search-button');
        this.loaderMore             = $('.load-more-pages');
        this.eventType              = $('#event-type');
        this.eventSort              = $('#event-sort');
        this.startDatePick          = $('#start-datePick');
        this.endDatePick            = $('#end-datePick');
        this.sortBy                 = $('#sort-by');
        this.featuredEvent          = $('.featured-event');
        this.clearBtn               = $('#clear-all');
        this.pageType               = '';
    }

    bindEvents = function () {
        this.page = 1;
        this.keywords.keyup(this.beforeDelayFilter);
        this.searchBtn.on('click', this.beforeDelayFilter);
        this.eventType.on('change', this.beforeDelayFilter);
        this.eventSort.on('change', this.beforeDelayFilter);
        this.startDatePick.on('change', this.beforeDelayFilter);
        this.endDatePick.on('change', this.beforeDelayFilter);
        this.loaderMore.on('click', this.nextPage);
        this.clearBtn.on('click', this.clearAll);
    };

    clearAll = () => {
        this.keywords.val('');
        this.eventType.val('').trigger('change');
        this.eventSort.val('upcoming').trigger('change');

        this.startDatePick.val('');
        this.endDatePick.val('');

        this.hideClearAll();
        this.delayFilter();
    };

    nextPage = (e) => {
        e.preventDefault();
        this.addPage();
        this.showLoader();
        this.loadMore();
        this.hideFeaturedEvent();
    };

    hideFeaturedEvent = () => {
        if(this.featuredEvent) {
            this.featuredEvent.addClass('d-none');
        }
    };

    loadMore = () => {
        $.ajax({
            type: "POST",
            dataType: "html",
            url: ajaxurl,
            data: {
                keyword: this.getKeywords(),
                type: this.getEventType(),
                sortBy: this.getEventSort(),
                start: this.getStartDatePick(),
                end: this.getEndDatePick(),
                page: this.page,
                action: 'events_filters_post_ajax',
            },
            success: this.appendItems,
        });
    };
    appendItems = (response) => {
        response = JSON.parse(response);
        if (response.success) {
            this.bindData.append(response.data);
        }

        this.lazyLoad();
        this.checkLoadMore(response.loadMoreValue);
        this.hideLoader();
    };

    beforeDelayFilter = () => {
        this.showClearAll();
        this.delayFilter();
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
                type: this.getEventType(),
                sortBy: this.getEventSort(),
                start: this.getStartDatePick(),
                end: this.getEndDatePick(),
                page: this.page,
                action: 'events_filters_post_ajax',
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

        this.lazyLoad();
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

    getEventType = () => {
        return this.eventType.val() ? encodeURI(this.eventType.val()) : '';
    };

    getEventSort = () => {
        return this.eventSort.val() ? encodeURI(this.eventSort.val()) : '';
    };

    getStartDatePick = () => {
        return this.startDatePick.val() ? encodeURI(this.startDatePick.val()) : '';
    };

    getEndDatePick = () => {
        return this.endDatePick.val() ? encodeURI(this.endDatePick.val()) : '';
    };

    showClearAll = () => {
        this.clearBtn.css('display', 'block');
    };

    hideClearAll = () => {
        this.clearBtn.css('display', 'none');
    };

    lazyLoad = () => {
        const observer = lozad('.lozad', {
            rootMargin: '100px 0px', // syntax similar to that of CSS Margin
            threshold: 0.1, // ratio of element convergence
            enableAutoReload: true // it will reload the new image when validating attributes changes
        });
        observer.observe();
    }
}