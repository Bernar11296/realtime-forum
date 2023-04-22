class Router {
    constructor(routes) {
      this.routes = routes;
      this.renderPage = this.renderPage.bind(this);
      window.addEventListener('popstate', this.renderPage);
    }
  
    renderPage() {
      const path = window.location.pathname;
      const routeHandler = this.routes[path];
      if (routeHandler) {
        routeHandler();
      }
    }
  
    navigateTo(url) {
      window.history.pushState(null, null, url);
      this.renderPage();
    }
  
    start() {
      document.addEventListener('click', event => {
        const link = event.target.closest('[data-link]');
        if (link) {
          event.preventDefault();
          this.navigateTo(link.href);
        }
      });
  
      this.renderPage();
    }
}
export default Router;