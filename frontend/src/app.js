import Router from "./Router/route.js";
import Navigation from "./component/navigation.js";
import renderAbout from "./component/about.js";
import renderHome from "./component/home.js";
import renderContact from "./component/contact.js";

const routes = {
  '/': 'Home',
  '/about': 'About',
  '/contact': 'Contact'
};

const router = new Router({
  '/': renderHome,
  '/about': renderAbout,
  '/contact': renderContact
});

const navigation = new Navigation(routes);

router.start();