import Messages from './components/Messages.vue';
import NewMessage from './components/NewMessage.vue';

export const routes = [
	{ path: '/messages' , component: Messages , name: 'messagesLink'},
	{ path: '/' , component: NewMessage , name: 'newMessageLink'}
];