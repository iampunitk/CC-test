import lozad from 'lozad';

export default class OurOffices {
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

        this.serviceList        = $('#service-list');
        this.serviceListItems   = $('#service-list-items');
        this.serviceType        = $('.service-type');
        this.setServicesType    = $('.set-services-type');

        this.clearBtn           = $('#clear-all');
        this.searchBtn          = $('#search-button');
        this.keywords           = $('#keywords');
        this.loadMore           = $('.load-more-posts');
        this.bindData           = $("#ajax-return");

        this.officeDuration     = $("#office-duration");
        this.officeLocation     = $("#office-location");

        this.parent_post_id     = $("#parent_post_id");
        this.filterAction       = $("#filter_action");

        this.selectedIndustry   = '';
        this.selectedSortBy     = '';
    };

    bindEvents = () => {
        this.industryList.on('click', this.toggleIndustryList);
        this.industryType.on('click', this.setIndustryValue);

        this.sortBy.on('click', this.toggleSortBy);
        this.sortByType.on('click', this.setSortByTypeValue);

        this.serviceList.on('click', this.toggleServiceList);
        this.serviceType.on('click', this.setServicesValue);

        this.clearBtn.on('click', this.clearAll);
        this.searchBtn.on('click', this.beforeDelayFilter);
        this.keywords.keyup(this.beforeDelayFilter);
        this.loadMore.on('click', this.nextPage);
        this.officeDuration.on('change', this.beforeDelayFilter);
        this.officeLocation.on('change', this.beforeDelayFilter);
    };

    clearAll = () => {
        this.industryListItems.removeClass('show');
        this.sortBySubMenu.removeClass('show');
        this.serviceListItems.removeClass('show');

        this.industryList.removeClass('show-sub');
        this.industryList.removeClass('active');
        this.sortBy.removeClass('show-sub');
        this.sortBy.removeClass('active');
        this.serviceList.removeClass('show-sub');
        this.serviceList.removeClass('active');

        this.setIndustryType.text('Industries');
        this.setSortByType.text('Sort by');
        this.setServicesType.text('Services');

        this.keywords.val('');
        this.selectedService = '';
        this.selectedIndustry = '';
        this.selectedSortBy = '';
        this.officeDuration.val('').trigger('change');
        this.officeLocation.val('').trigger('change');

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

    toggleServiceList = () => {
        this.serviceListItems.toggleClass('show');
        this.serviceList.toggleClass('show-sub');
    };
    setServicesValue = (e) => {
        let item = $(e.currentTarget);
        let order_text = item.text();
        let order_type = item.data('order');

        this.selectedService = order_type;
        this.setServicesType.text(order_text);
        this.serviceList.removeClass('show-sub');
        this.serviceList.addClass('active');
        this.serviceListItems.toggleClass('show');

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
                service: this.getService(),
                industry: this.getIndustry(),
                sortBy: this.getSortBy(),
                location: this.getOfficeLocation(),
                duration: this.getOfficeDuration(),
                page: this.page,
                parent_post_id: this.getParentPostId(),
                action: this.getFilterAction(),
            },
            success: this.applyFilters,
        });
    };
    applyFilters = (response) => {
        response = JSON.parse(response);
        let data;

        if (!response.success) {
            data = `<p>Sorry, no posts matched your criteria.</p>`;
        } else {
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
                service: this.getService(),
                industry: this.getIndustry(),
                sortBy: this.getSortBy(),
                location: this.getOfficeLocation(),
                duration: this.getOfficeDuration(),
                page: this.page,
                parent_post_id: this.getParentPostId(),
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

    lazyLoad = () => {
        const observer = lozad('.lozad', {
            rootMargin: '100px 0px', // syntax similar to that of CSS Margin
            threshold: 0.1, // ratio of element convergence
            enableAutoReload: true // it will reload the new image when validating attributes changes
        });
        observer.observe();
    }

    getService = () => {
        return this.selectedService ? encodeURI(this.selectedService) : '';
    };

    getParentPostId = () => {
        return this.parent_post_id ? this.parent_post_id.val() : '';
    };

    getFilterAction = () => {
        return this.filterAction.val() ? this.filterAction.val() : 'our_offices_filter_ajax';
    };

    getOfficeLocation = () => {
        return this.officeLocation.val() ? encodeURI(this.officeLocation.val()) : '';
    };

    getOfficeDuration = () => {
        return this.officeDuration.val() ? encodeURI(this.officeDuration.val()) : '';
    };

    showClearAll = () => {
        this.clearBtn.css('display', 'block');
    };

    hideClearAll = () => {
        this.clearBtn.css('display', 'none');
    };
}