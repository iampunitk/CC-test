import Plyr from 'plyr';

export default class VideoGallery {
    constructor() {
        this.$window = $(window);
        this.$document = $(document);
        jQuery(() => {
            this.domReady();
        });
    }
    domReady = () => {
        this.initComponents();
        this.bindEvents();
    };
    initComponents = () => {
        const players = Array.from(document.querySelectorAll('.js-player')).map(p => new Plyr(p));
    };
    bindEvents = () => {
        
    }
}