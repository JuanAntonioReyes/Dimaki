import axios from 'axios';

var config = require('../config/config.js');

export default {
  fetchMessages(params) {
		return axios.create({ baseURL: config.apiUrl }).get('api/messages', params);
  },
  addMessage(params) {
		return axios.create({ baseURL: config.apiUrl }).post('api/messages', params);
	}
}