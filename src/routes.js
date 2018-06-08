import Messages from './components/Messages.vue';
import NewMessage from './components/NewMessage.vue';
import Register from './components/Register.vue';
import Login from './components/Login.vue';
import UserProfile from './components/userProfile/Profile.vue';

function checkLogged(to, from, next) {
	var userToken = localStorage.getItem("userToken");

	if (userToken) {
		next({ name: 'messagesLink' });
	} else {
		next();
	}
}

export const routes = [
	{ path: '/' , component: Messages , name: 'messagesLink'},
	{ path: '/newMessage' , component: NewMessage , name: 'newMessageLink' ,
		meta: { requiresAuth: true }
	},
	{ path: '/register' , component: Register , name: 'registerLink' ,
		beforeEnter: checkLogged
	},
	{ path: '/login' , component: Login , name: 'loginLink' ,
		beforeEnter: checkLogged
	},
	{ path: '/userProfile' , component: UserProfile , name: 'userProfileLink' ,
		meta: { requiresAuth: true }
	},
	{ path: '*' , component: Messages }
];