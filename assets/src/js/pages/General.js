import lozad from 'lozad';

export default class General {
    constructor() {
        this.init();
        this.bindEvents();
    }

    init = () => {
        this.page           = 1;
        this.searchBtn      = $('#search-button');
        this.keywords       = $('#keywords');
        this.loadMore       = $('.load-more-posts');
        this.postType       = $('#post_type');
        this.bindData       = $("#ajax-return");
        this.loadMoreAction = $("#load_more_action");
    };

    bindEvents = () => {
        this.searchBtn.on('click', this.filterSearch);
        this.keywords.keyup(this.delayFilter);
        this.loadMore.on('click', this.nextPage);
    };

    delayFilter = () => {
        this.showLoader();
        clearInterval(this.timer);
        this.timer = setTimeout(() => {
            this.filterSearch();
        }, 500);
    };
    filterSearch = () => {
        this.resetPage();
        $.ajax({
            type: "POST",
            dataType: "html",
            url: ajaxurl,
            data: {
                keyword: this.getKeywords(),
                post_type: this.getPostType(),
                page: this.page,
                action: 'general_filter_ajax',
            },
            success: this.applyFilters,
            error:  (jqXHR, textStatus, errorThrown) => {
                console.log(textStatus + " :: " + errorThrown);
            }
        });
    };
    applyFilters = (response) => {
        response = JSON.parse(response);

        this.bindData.empty();
        this.bindData.append(response.data);

        this.checkLoadMore(response.loadMoreValue);
        this.hideLoader();
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
                post_type: this.getPostType(),
                page: this.page,
                action: this.getLoadMoreAction(),
            },
            success: this.appendItems,
            error:  (jqXHR, textStatus, errorThrown) => {
                console.log(textStatus + " :: " + errorThrown);
            }
        });

        return false;
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

    getPostType = () => {
        return this.postType.val() ? encodeURI(this.postType.val()) : '';
    };

    getLoadMoreAction = () => {
        return this.loadMoreAction.val() ? this.loadMoreAction.val() : 'load_more_post_ajax';
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