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
					email: null
				}
			}
		},
		methods: {
    	async registerUser() {
				await apiAccess.registerUser(this.newUser);

				this.$router.push({ name: 'messagesLink' })
			}
  }
}
</script>

<style>
	
</style>