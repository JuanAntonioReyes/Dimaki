<template>
<div class="posts">
	<h1>Login</h1>

	<b-form @submit="login">

		<span id="info"></span>

		<b-row class="form-group">
			<b-col tag="label" sm="3">
				Username
			</b-col>
			<b-col sm="12" md="9">
				<input type="text" class="form-control" v-model="loginData.name">
			</b-col>
		</b-row>

		<b-row class="form-group">
			<b-col tag="label" sm="3">
				Password
			</b-col>
			<b-col sm="12" md="9">
				<input type="password" class="form-control" v-model="loginData.pass">
			</b-col>
		</b-row>

		<b-row class="form-group">
			<b-col sm="12" class="text-center">
				<b-button type="submit" variant="success">
					Login
				</b-button>
			</b-col>
		</b-row>

	</b-form>

	<br>
	You don't have an account?<br>
	<router-link :to="{ name: 'registerLink' }" class="nav-item">
		Register now!
	</router-link>

</div>
</template>

<script>
	import apiAccess from '../js/apiAccess.js';

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

    	async login(e) {
    		e.preventDefault();

				var infoSpan = document.getElementById('info');
				
				if (this.loginData.name && this.loginData.pass) {
					
					apiAccess.loginUser(this.loginData)
					.then((response) => {
						if (typeof(Storage) !== "undefined") {
							localStorage.setItem("userToken", response.data.token);
						} else {
							alert("Your browser does not support user token control\n" +
										"Please, update your browser to continue using this app");
						}

						this.$emit('loginLogout', true);

						this.$router.push({ name: 'messagesLink' });
					})
					.catch((error) => {
						infoSpan.textContent = error.response.data.message;
					});

				} else {
					infoSpan.textContent = "You must fill all the fields";
				}

			}
	
  }
}
</script>
