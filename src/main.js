// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import { routes } from './routes.js';
import BootstrapVue from 'bootstrap-vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);
Vue.use(VueRouter);

Vue.config.productionTip = false

const router = new VueRouter({
	routes,
	mode: 'history'
});

router.beforeEach((to,from,next) => {
	var userToken = localStorage.getItem("userToken");
	var requiresAuth = to.matched.some(record => record.meta.requiresAuth);

	if (requiresAuth && !userToken) {
		next({ name: 'loginLink' });
	} else {
		next();
	}
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
