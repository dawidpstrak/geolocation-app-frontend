import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import store from '@/store';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/Register.vue')
    },
    {
        path: '/geolocations',
        name: 'geolocations',
        component: () => import('../views/Geolocations.vue')
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const routesForLoggedUsers: string[] = ['geolocations'];

    if (routesForLoggedUsers.some(routeName => routeName === to.name) && !store.getters.loggedUser) {
        next({ name: 'login' });
    }

    next();
});

export default router;
