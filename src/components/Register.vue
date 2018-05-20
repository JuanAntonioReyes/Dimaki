<template>
	<div class="posts">
		<h1>Register user</h1>
		<div class="form">
			<div>
				Name: <input type="text" v-model="newUser.name"><br>
				Password: <input type="password" v-model="newUser.pass"><br>
				e-mail: <input type="text" v-model="newUser.email"><br>
			</div>
			<div>
				<button @click="registerUser">Register</button>
			</div>
		</div>
	</div>
</template>

<script>
	import apiAccess from '../apiAccess.js';

	export default {
		data() {
			return {
				newUser: {
					name: null,
					pass: null,
					email: null,
					registerDate: null
				}
			}
		},
		mounted() {
			this.newUser.registerDate = Date.now();
		},
		methods: {
    	async registerUser() {
				var response = await apiAccess.registerUser(this.newUser);

				// Before this, I should check if the browser supports localStorage
				localStorage.setItem("userToken", response.data.token);

				this.$router.push({ name: 'messagesLink' });
			}
  }
}
</script>

<style>
	
</style>