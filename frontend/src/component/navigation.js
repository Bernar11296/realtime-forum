class Navigation {
    constructor(routes) {
      this.routes = routes;
      this.render();
      this.addEventListeners();
    }
  
    render() {
        const nav = document.createElement('nav');
        nav.innerHTML = `
          <ul>
            ${Object.entries(this.routes).map(([path, label]) => `
              <li><a href="${path}">${label}</a></li>
            `).join('')}
          </ul>
        `;
        document.body.prepend(nav);
      }
  
    addEventListeners() {
      document.addEventListener('click', (event) => {
        const link = event.target.closest('[data-link]');
        if (link) {
          event.preventDefault();
          const url = link.href;
          window.history.pushState(null, null, url);
          this.renderActiveLink(url);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      });
      window.addEventListener('popstate', () => {
        this.renderActiveLink(window.location.pathname);
      });
    }
  
    renderActiveLink(url) {
      const currentLink = document.querySelector('nav a.active');
      if (currentLink) {
        currentLink.classList.remove('active');
      }
      const newLink = document.querySelector(`nav a[href="${url}"]`);
      if (newLink) {
        newLink.classList.add('active');
      }
    }
  }
  
  export default Navigation;
  