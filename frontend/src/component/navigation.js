function renderNav(routes, navDiv, usrObj) {

    const navLinks = routes.map((route) => {
        const link = document.createElement("a");
        link.href = route.path;
        link.textContent = route.pathName;
        if (route.display) {
            return link;
        }
        return null;
    }).filter((link) => link !== null);
    navDiv.innerHTML = ""; // clear navDiv before adding new links

    navLinks.forEach((link) => {
        if (link !== null) { // if link is not null (i.e. if it's not a route that requires auth and user is not authenticated), append to navDiv
            navDiv.appendChild(link);
        }
    });
    if (usrObj) {
        const link = document.createElement("a");
        link.textContent = usrObj.Username;
        navDiv.appendChild(link);
    }
}

export default renderNav;