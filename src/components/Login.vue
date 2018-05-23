<template>
<div class="posts">
	<h1>Login</h1>

	<b-form @submit="login">

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

    	async login(e) {
    		e.preventDefault();
// ==============================================================
// TODO:
// CHECK HERE THAT ALL THE DATA IS SAVED AND CORRECT BEFORE
// MAKING THE API CALL!!!!
// ==============================================================
				var response = await apiAccess.loginUser(this.loginData);

				if (typeof(Storage) !== "undefined") {
					localStorage.setItem("userToken", response.data.token);
				} else {
					alert("Your browser does not support user token control\n" +
								"Please, update your browser to continue using this app");
				}

				this.$emit('login', true);

				this.$router.push({ name: 'messagesLink' });
			}
	
  }
}
</script>
