function renderNav(routes, navDiv) {
    const navLinks = routes.map((route) => {
        const link = document.createElement("a");
        link.href = route.path;
        link.textContent = route.pathName;
        return link;
    });
    navDiv.innerHTML = "";
    navLinks.forEach((link) => navDiv.appendChild(link));
}

export default renderNav;