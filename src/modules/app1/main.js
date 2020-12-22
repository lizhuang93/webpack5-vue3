import { createApp } from 'vue';
import App from '@/components/app.vue';
import router from './router';

createApp(App).use(router).mount('#app');