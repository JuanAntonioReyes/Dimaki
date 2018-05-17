<template>
	<div class="posts">
		<h1>Login</h1>
		<div class="form">
			<div>
				Username: <input type="text" v-model="loginData.name"><br>
				Password: <input type="password" v-model="loginData.pass"><br>
			</div>
			<div>
				<button @click="login">Login</button>
			</div>
		</div>
		<router-link :to="{ name: 'registerLink' }" tag="li" class="nav-item">
			You don't have an account? <a href="">Register now!</a>
		</router-link>
	</div>
</template>

<script>
	import apiAccess from '../apiAccess.js';

	export default {
		data() {
			return {
				loginData: {
					name: null,
					pass: null
				}
			}
		},
		methods: {
    	async login() {
				var response = await apiAccess.loginUser(this.loginData);

				// Before this, I should check if the browser supports localStorage
				localStorage.setItem("userToken", response.data.token);

				this.$router.push({ name: 'messagesLink' });
			}
  }
}
</script>

<style>
	
</style>