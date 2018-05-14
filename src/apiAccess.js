import axios from 'axios'

var config = require('../config/config.js');

export default {
  getMessages () {
		return axios.create({ baseURL: config.apiUrl }).get('api/messages');
  }
}