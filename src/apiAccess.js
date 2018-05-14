import axios from 'axios'

var config = require('../config/config.js');

export default {
  fetchMessages() {
		return axios.create({ baseURL: config.apiUrl }).get('api/messages');
  },
  addMessage(params) {
		return axios.create({ baseURL: config.apiUrl }).post('api/messages', params)
	}
}