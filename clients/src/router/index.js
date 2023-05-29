import * as VueRouter from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import PrimaryLayout from '../views/authorised/index.vue';
import Profile from '../views/authorised/profile/index.vue';
import Feed from '../views/authorised/feed/index.vue';
import Post from '../components/post/index.vue';
import Editor from '../components/editor/index.vue';
import Favorite from '../views/authorised/favorite/index.vue';
import Offlined from '../views/authorised/offlined/index.vue';
import ReadingSession from '../views/authorised/reading-session/index.vue';

const routes = [
  {
    path: '/',
    name: 'PrimaryLayout',
    component: PrimaryLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'feed',
        component: Feed,
      },
      {
        path: 'post/:id',
        name: 'post',
        component: Post,
      },
      {
        path: 'author/:id',
        name: 'authorProfile',
        component: Profile,
      },
      {
        path: 'profile',
        name: 'profile',
        component: Profile,
      },
      {
        path: 'editor',
        name: 'editor',
        component: Editor,
      },
      {
        path: 'fav/:type',
        name: 'fav',
        component: Favorite,
      },
      {
        path: 'offlined',
        name: 'offlined',
        component: Offlined,
      },
      {
        path: 'reading-session',
        name: 'ReadingSession',
        component: ReadingSession,
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false },
  },
];

const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHistory(),
  routes, // short for `routes: routes`
});

router.beforeEach((to, from, next) => {
  const isAuthenticated =
    localStorage.getItem(
      'isAuthenticated',
    ); /* Check if the user is logged in */
  if (typeof Storage !== 'undefined') {
    // Code for localStorage/localStorage.
  } else {
    alert('Unable support ');
  }
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    if (isAuthenticated) {
      // User is authenticated, proceed to the requested route
      next();
    } else {
      // User is not authenticated, redirect to the login page
      next('/login'); // Replace '/login' with the actual path to your login page
    }
  } else {
    // Route doesn't require authentication, proceed as usual
    if (
      (isAuthenticated && to.path === '/login') ||
      (isAuthenticated && to.path === '/register')
    ) {
      // User is authenticated but trying to access the login page, redirect to feed or any other desired page
      next('/'); // Replace '/feed' with the actual path to the feed page or another appropriate page
    } else {
      next();
    }
  }
});

export default router;
