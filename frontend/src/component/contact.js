function renderContact() {
    const contactPage = document.createElement('h1');
    contactPage.textContent = 'Contact';
    app.innerHTML = '';
    app.appendChild(contactPage);
  }
  export default renderContact;