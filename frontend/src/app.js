const appDiv = document.getElementById("app");
const nav = document.getElementById("nav");

import renderNav from "./component/navigation.js";
import home from "./component/pages/home.js"
import sign_up from "./component/pages/sign_up.js"
import sign_in from "./component/pages/sign_in.js"
import create_post from "./component/pages/create_post.js";
import { check_auth, log_out } from "./api/auth.js";
import post from "./component/pages/post.js";




const router = async() => {
    let usrObj;
    try {
        usrObj = await check_auth();
    } catch (error) {
        console.log(error);
        appDiv.innerHTML = "<h1>Error: " + error.message + "</h1>";
        return
    }
    const routes = [
        { path: "/", pathName: "Home", view: home, display: usrObj !== null, component: true },
        { path: "/sign_in", pathName: "Sign in", view: sign_in, display: usrObj === null, component: true },
        { path: "/sign_up", pathName: "Sign up", view: sign_up, display: usrObj === null, component: true },
        { path: "/create_post", pathName: "Create post", view: create_post, display: usrObj !== null, component: true },
        { path: "/logout", pathName: "Log out", view: log_out, display: usrObj !== null, component: true },
        { path: "/post", pathName: "Post", view: post, display: true, component: false }
    ];
    const matchingRoute = routes.find((route) => route.path === window.location.pathname);
    if (!matchingRoute || !matchingRoute.display) {
        appDiv.innerHTML = "<h1>Page not found</h1>";
    } else if (matchingRoute && matchingRoute.display) {
        matchingRoute.view(usrObj);
    } else {
        matchingRoute.view();
    }
    renderNav(routes, nav, usrObj)
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