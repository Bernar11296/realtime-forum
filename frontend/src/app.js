const appDiv = document.getElementById("app");
const nav = document.getElementById("nav");

import renderNav from "./component/navigation.js";
import home from "./component/pages/home.js"
import register from "./component/pages/register.js"
import auth from "./component/pages/auth.js"
// import { check_auth } from "./api/check.js";


const routes = [
    { path: "/", pathName: "Home", view: home, auth: true },
    { path: "/auth", pathName: "auth", view: auth, auth: false },
    { path: "/register", pathName: "register", view: register, auth: false },
];

const router = async() => {
    const matchingRoute = routes.find((route) => route.path === window.location.pathname);

    if (!matchingRoute) {
        appDiv.innerHTML = "<h1>Page not found</h1>";
        return;
    }
    let usrObj;
    try {
        // authenticated = await check_auth();
        usrObj = {
            Username: "Diyar",
            Auth: true
        }
    } catch (error) {
        appDiv.innerHTML = "<h1>Error: " + error.message + "</h1>";
        return
    }
    renderNav(routes, nav, usrObj)
    matchingRoute.view();
};

document.addEventListener("click", (event) => {
    if (event.target.tagName !== "A") {
        return;
    }

    event.preventDefault();

    window.history.pushState(null, null, event.target.href);

    router();
});

window.addEventListener("popstate", router);
router();