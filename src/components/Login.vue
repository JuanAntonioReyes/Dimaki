<template>
	<div class="posts">
		<h1>Login</h1>
		<div class="form">
			<div>
				e-mail: <input type="text" v-model="loginData.email"><br>
				Password: <input type="password" v-model="loginData.pass"><br>
			</div>
			<div>
				<button @click="login">Login</button>
			</div>
		</div>
	</div>
</template>

<script>
	import apiAccess from '../apiAccess.js';

	export default {
		data() {
			return {
				loginData: {
					email: null,
					pass: null
				}
			}
		},
		methods: {
    	async login() {
				await apiAccess.login(this.loginData);

				this.$router.push({ name: 'messagesLink' })
			}
  }
}
</script>

<style>
	
</style>