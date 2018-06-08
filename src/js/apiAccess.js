import axios from 'axios';

var config = require('../../config/config.js');
var userToken;
var axiosInstance = axios.create({ baseURL: config.apiUrl });

export default {

	fetchMessages(params) {
		var urlGet = 'api/messages/' + params[0] + '/' + params[1]+ 
									'/' + params[2] + '/' + params [3];
		
		return axiosInstance.get(urlGet);
	},

	addMessage(params) {
		userToken = localStorage.getItem('userToken');
		axiosInstance.defaults.headers.common['x-access-token'] = userToken;
		return axiosInstance.post('api/messages', params);
	},

	registerUser(params) {
		return axiosInstance.post('api/registerUser', params);
	},

	loginUser(params) {
		return axiosInstance.post('api/loginUser', params);
	}//,

// NOT USED YET
/*	getLoggedUser() {
		userToken = localStorage.getItem('userToken');
		axiosInstance.defaults.headers.common['x-access-token'] = userToken;

		return axiosInstance.get('api/loggedUser');
	}*/
	
}
