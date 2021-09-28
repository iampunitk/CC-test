import lozad from 'lozad';

export default class News {
    constructor() {
        this.init();
        this.bindEvents();
    }

    init = () => {
        this.page               = 1;
        this.industryList       = $('#industry-list');
        this.industryListItems  = $('#industry-list-items');
        this.industryType       = $('.industry-type');
        this.setIndustryType    = $('.set-industry-type');

        this.sortBy             = $('#sort-by');
        this.sortBySubMenu      = $('#sort-by-sub-menu');
        this.sortByType         = $('.sort-by-type');
        this.setSortByType      = $('.set-sort-by-type');

        this.officeList         = $('#offices-list');
        this.officeListItems    = $('#office-list-items');
        this.officeType         = $('.office-type');
        this.setOfficeType      = $('.set-office-type');

        this.clearBtn           = $('#clear-all');
        this.searchBtn          = $('#search-button');
        this.keywords           = $('#keywords');
        this.loadMore           = $('.load-more-posts');
        this.bindData           = $("#ajax-return");
        this.bindFeaturedData   = $("#featured-return");

        this.filterAction       = $("#filter_action");
        this.newsCategory       = $("#news-cat");

        this.selectedIndustry   = '';
        this.selectedSortBy     = '';
    };

    bindEvents = () => {
        this.industryList.on('click', this.toggleIndustryList);
        this.industryType.on('click', this.setIndustryValue);

        this.sortBy.on('click', this.toggleSortBy);
        this.sortByType.on('click', this.setSortByTypeValue);

        this.officeList.on('click', this.toggleOfficeList);
        this.officeType.on('click', this.setOfficeValue);

        this.clearBtn.on('click', this.clearAll);
        this.searchBtn.on('click', this.beforeDelayFilter);
        this.keywords.keyup(this.beforeDelayFilter);
        this.loadMore.on('click', this.nextPage);
        this.newsCategory.on('change', this.beforeDelayFilter);
    };

    clearAll = () => {
        this.industryListItems.removeClass('show');
        this.sortBySubMenu.removeClass('show');
        this.officeListItems.removeClass('show');

        this.industryList.removeClass('show-sub');
        this.industryList.removeClass('active');
        this.sortBy.removeClass('show-sub');
        this.sortBy.removeClass('active');
        this.officeList.removeClass('show-sub');
        this.officeList.removeClass('active');

        this.setIndustryType.text('Industries');
        this.setSortByType.text('Sort by');
        this.setOfficeType.text('All');

        this.keywords.val('');
        this.newsCategory.val('all').trigger('change');
        this.selectedOffice = '';
        this.selectedIndustry = '';
        this.selectedSortBy = '';

        this.hideClearAll();
        this.delayFilter();
    };

    toggleIndustryList = () => {
        this.industryListItems.toggleClass('show');
        this.industryList.toggleClass('show-sub');
    };
    setIndustryValue = (e) => {
        let item = $(e.currentTarget);
        let order_text = item.text();
        let order_type = item.data('order');

        this.selectedIndustry = order_type;
        this.setIndustryType.text(order_text);
        this.industryList.removeClass('show-sub');
        this.industryList.addClass('active');
        this.industryListItems.toggleClass('show');

        this.beforeDelayFilter();
    };

    toggleSortBy = () => {
        this.sortBySubMenu.toggleClass('show');
        this.sortBy.toggleClass('show-sub');
    };
    setSortByTypeValue = (e) => {
        let item = $(e.currentTarget);
        let order_text = item.text();
        let order_type = item.data('order');

        this.selectedSortBy = order_type;
        this.setSortByType.text(order_text);
        this.sortBy.addClass('active');

        this.beforeDelayFilter();
    };

    toggleOfficeList = () => {
        this.officeListItems.toggleClass('show');
        this.officeList.toggleClass('show-sub');
    };
    setOfficeValue = (e) => {
        let item = $(e.currentTarget);
        let order_text = item.text();
        let order_type = item.data('order');

        this.selectedOffice = order_type;
        this.setOfficeType.text(order_text);
        this.officeList.removeClass('show-sub');
        this.officeList.addClass('active');
        this.officeListItems.toggleClass('show');

        this.beforeDelayFilter();
    };

    beforeDelayFilter = () => {
        this.showClearAll();
        this.delayFilter();
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
                industry: this.getIndustry(),
                office: this.getOffice(),
                category: this.getCategory(),
                sortBy: this.getSortBy(),
                page: this.page,
                action: this.getFilterAction(),
            },
            success: this.applyFilters,
        });
    };
    applyFilters = (response) => {
        response = JSON.parse(response);
        let data;

        if(this.bindFeaturedData.length) {
            this.bindFeaturedData.empty();
            if (response.featured) {
                this.bindFeaturedData.append(response.featured);
            }
        }

        if (!response.data && !response.featured) {
            data = `<p>No Items found</p>`;
        } else if (response.data) {
            data = $(response.data);
        }

        this.bindData.empty();
        this.bindData.append(data);

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
                industry: this.getIndustry(),
                office: this.getOffice(),
                category: this.getCategory(),
                sortBy: this.getSortBy(),
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

    getIndustry = () => {
        return this.selectedIndustry ? encodeURI(this.selectedIndustry) : '';
    };

    getSortBy = () => {
        return this.selectedSortBy ? encodeURI(this.selectedSortBy) : '';
    };

    getFilterAction = () => {
        return this.filterAction ? this.filterAction.val() : 'news_filter_ajax';
    }

    getOffice = () => {
        return this.selectedOffice ? encodeURI(this.selectedOffice) : '';
    };

    getCategory = () => {
        return this.newsCategory.val() ? encodeURI(this.newsCategory.val()) : '';
    };

    lazyLoad = () => {
        const observer = lozad('.lozad', {
            rootMargin: '100px 0px', // syntax similar to that of CSS Margin
            threshold: 0.1, // ratio of element convergence
            enableAutoReload: true // it will reload the new image when validating attributes changes
        });
        observer.observe();
    }

    showClearAll = () => {
        this.clearBtn.css('display', 'block');
    };

    hideClearAll = () => {
        this.clearBtn.css('display', 'none');
    };
}