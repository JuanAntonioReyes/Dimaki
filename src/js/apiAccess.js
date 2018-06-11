import axios from 'axios';

var config = require('../../config/config.js');
var axiosInstance = axios.create({ baseURL: config.apiUrl });

function setHeaders() {
	var userToken = localStorage.getItem('userToken');
	axiosInstance.defaults.headers.common['x-access-token'] = userToken;
}

export default {

	fetchMessages(params) {
		var urlGet = 'api/messages/' + params[0] + '/' + params[1]+ 
									'/' + params[2] + '/' + params [3];
		
		return axiosInstance.get(urlGet);
	},

	fetchUserMessages() {
		setHeaders();
		return axiosInstance.get('api/userMessages/');
	},

	addMessage(params) {
		setHeaders();
		return axiosInstance.post('api/messages', params);
	},

	deleteMessage(params) {
		setHeaders();
		return axiosInstance.delete('api/messages/' + params);
	},

	registerUser(params) {
		return axiosInstance.post('api/registerUser', params);
	},

	loginUser(params) {
		return axiosInstance.post('api/loginUser', params);
	},

	getLoggedUser() {
		setHeaders();
		return axiosInstance.get('api/loggedUser');
	}
	
}
