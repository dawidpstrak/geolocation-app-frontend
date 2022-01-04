import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Notifications from '@kyvg/vue3-notification';

import './assets/scss/main.scss';

createApp(App).use(store).use(router).use(Notifications).mount('#app');
