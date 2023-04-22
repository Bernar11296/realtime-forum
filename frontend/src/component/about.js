function renderAbout() {
    const aboutPage = document.createElement('h1');
    aboutPage.textContent = 'About';
    app.innerHTML = '';
    app.appendChild(aboutPage);
  }
  
export default renderAbout;