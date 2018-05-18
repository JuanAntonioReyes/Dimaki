import axios from 'axios';

var config = require('../config/config.js');
var userToken = localStorage.getItem('userToken');
var axiosInstance = axios.create({
																	baseURL: config.apiUrl,
																	headers: { 'x-access-token': userToken }
																});

export default {
	async fetchMessages(params) {
		var urlGet = 'api/messages/' + params[0] + '/' + params[1];
		
		let result = await axiosInstance.get(urlGet);

		return result;
	},
	addMessage(params) {
		return axiosInstance.post('api/messages', params);
	},
	registerUser(params) {
		return axiosInstance.post('api/registerUser', params);
	},
	loginUser(params) {
		return axiosInstance.post('api/loginUser', params);
	},
	getLoggedUser() {
		return axiosInstance.get('api/loggedUser');
	},
}
