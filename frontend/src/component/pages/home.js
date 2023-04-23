 function renderHome() {
    const homePage = document.createElement('h1');
    homePage.textContent = 'Home';
    app.innerHTML = '';
    app.appendChild(homePage);
  }
  
export default renderHome;