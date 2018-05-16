import axios from 'axios';

var config = require('../config/config.js');

export default {
	fetchMessages(params) {
		var urlGet = 'api/messages/' + params[0] + '/' + params[1];
		
		return axios.create({ baseURL: config.apiUrl }).get(urlGet);
	},
	addMessage(params) {
		return axios.create({ baseURL: config.apiUrl }).post('api/messages', params);
	},
	registerUser(params) {
		return axios.create({ baseURL: config.apiUrl }).post('api/register', params);
	}
}