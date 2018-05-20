import Messages from './components/Messages.vue';
import NewMessage from './components/NewMessage.vue';
import Register from './components/Register.vue';
import Login from './components/Login.vue';

export const routes = [
	{ path: '/' , component: Messages , name: 'messagesLink'},
	{ path: '/newMessage' , component: NewMessage , name: 'newMessageLink' , meta: { requiresAuth: true } },
	{ path: '/register' , component: Register , name: 'registerLink'},
	{ path: '/login' , component: Login , name: 'loginLink'},
	{ path: '*' , component: Messages }
];