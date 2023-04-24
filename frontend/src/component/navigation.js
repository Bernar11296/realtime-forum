function renderNav(routes, navDiv, usrObj) {
    const navLinks = routes.map((route) => {
        const link = document.createElement("a");
        link.href = route.path;
        link.textContent = route.pathName;
        console.log((route.auth && usrObj), route.path);
        if (!(route.auth && usrObj)) {
            return null;
        }
        return link
    });

    navDiv.innerHTML = ""; // clear navDiv before adding new links

    navLinks.forEach((link) => {
        if (link !== null) { // if link is not null (i.e. if it's not a route that requires auth and user is not authenticated), append to navDiv
            navDiv.appendChild(link);
        }
    });
}

export default renderNav;