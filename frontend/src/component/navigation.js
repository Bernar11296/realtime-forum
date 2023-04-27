function renderNav(routes, navDiv, usrObj) {

    navDiv.innerHTML = "";

    routes.forEach((route) => {
        // console.log(route.display || route.component);
        if (!route.display || !route.nav) {
            return;
        }

        const link = document.createElement("a");
        link.href = route.path;
        link.textContent = route.pathName;
        navDiv.appendChild(link);
    });
    if (usrObj) {
        const link = document.createElement("a");
        link.textContent = usrObj.Username;
        navDiv.appendChild(link);
    }
}

export default renderNav;