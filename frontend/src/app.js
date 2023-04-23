const appDiv = document.getElementById("app");
const nav = document.getElementById("nav");

import renderNav from "./component/navigation.js";
import home from "./component/pages/home.js"
import register from "./component/pages/register.js"
import auth from "./component/pages/auth.js"
// import { check_auth } from "./api/check.js";


const routes = [
    { path: "/", pathName: "Home", view: home },
    { path: "/auth", pathName: "auth", view: auth },
    { path: "/register", pathName: "register", view: register },
];

const router = async() => {
    const matchingRoute = routes.find((route) => route.path === window.location.pathname);

    if (!matchingRoute) {
        appDiv.innerHTML = "<h1>Page not found</h1>";
        return;
    }
    // const authenticated = await check_auth();
    // if (!authenticated && matchingRoute.path !== '/auth') {
    //     window.location.href = '/auth'; // Redirect to login page if user is not authenticated
    //     return;
    // }
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
renderNav(routes, nav)
router();