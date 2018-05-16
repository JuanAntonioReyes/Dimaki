import axios from 'axios';

var config = require('../config/config.js');
var axiosObject = axios.create({ baseURL: config.apiUrl });

export default {
	fetchMessages(params) {
		var urlGet = 'api/messages/' + params[0] + '/' + params[1];
		
		return axiosObject.get(urlGet);
	},
	addMessage(params) {
		return axiosObject.post('api/messages', params);
	},
	registerUser(params) {
		return axiosObject.post('api/registerUser', params);
	},
	loginUser(params) {
		return axiosObject.post('api/loginUser', params);
	}
}
