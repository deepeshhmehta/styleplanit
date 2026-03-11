/**
 * learn.js - Style Wiki (Article Engine)
 */
const LearnFeature = {
    articles: [],

    init: async function() {
        console.log("🔍 [Learn] Init started...");
        const container = $("#wiki-article-container");
        if (container.length === 0) return;

        // Fetch articles from site-data.json
        this.articles = await Data.fetch("articles");
        
        if (this.articles.length === 0) {
            container.html('<p class="text-center">The Style Wiki is being updated. Please check back soon.</p>');
            return;
        }

        this.renderSidebar();
        this.bindEvents();

        // Load default article (first one) or from Hash
        const hash = window.location.hash.substring(1);
        const defaultArticle = this.articles.find(a => this.slugify(a.title) === hash) || this.articles[0];
        this.loadArticle(defaultArticle.title);
    },

    renderSidebar: function() {
        const list = $("#wiki-article-list");
        list.empty();
        
        this.articles.forEach(article => {
            const slug = this.slugify(article.title);
            list.append(`
                <li>
                    <a href="#${slug}" class="wiki-nav-link" data-title="${article.title}">
                        ${article.title}
                    </a>
                </li>
            `);
        });
    },

    loadArticle: function(title) {
        const article = this.articles.find(a => a.title === title);
        if (!article) return;

        const container = $("#wiki-article-container");
        const slug = this.slugify(article.title);

        // Update active state in sidebar
        $(".wiki-nav-link").removeClass("active");
        $(`.wiki-nav-link[data-title="${title}"]`).addClass("active");

        Analytics.trackInteraction('wiki_view', slug);

        container.hide().html(`
            <div class="wiki-article-view">
                <span class="section-subtitle">${article.category || 'Article'}</span>
                <h1 class="article-title">${article.title}</h1>
                <div class="article-meta">
                    <span class="read-time"><i class="far fa-clock"></i> ${article.read_time || '5 min'} read</span>
                </div>
                <div class="article-body">
                    ${article.content}
                </div>
                <div class="article-footer">
                    <hr>
                    <div class="article-cta">
                        <h4>Ready to apply this to your own brand?</h4>
                        <a href="https://cal.com/styleplanit/15min" target="_blank" class="btn btn-primary-accent">Book a Discovery Call</a>
                    </div>
                </div>
            </div>
        `).fadeIn(400);

        // Scroll to top of article on mobile
        if (window.innerWidth < 768) {
            const navHeight = $("nav").outerHeight() || 0;
            $("html, body").animate({
                scrollTop: container.offset().top - navHeight - 20
            }, 500);
        }
    },

    bindEvents: function() {
        const self = this;
        $(document).on("click", ".wiki-nav-link", function(e) {
            const title = $(this).data("title");
            self.loadArticle(title);
        });
    },

    slugify: function(text) {
        return text.toString().toLowerCase().trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    }
};
