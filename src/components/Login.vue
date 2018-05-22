<template>
	<div class="posts">
		<h1>Login</h1>

		<form>
			<div class="form-group row">
				<label class="col-sm-3">Username</label>
				<div class="col-sm-9">
					<input type="text" class="form-control"
						id="name" v-model="loginData.name">
				</div>
			</div>
			<div class="form-group row">
				<label class="col-sm-3">Password</label>
				<div class="col-sm-9">
					<input type="password" class="form-control"
						id="pass" v-model="loginData.pass">
				</div>
			</div>
			<button class="btn btn-primary" @click.prevent="login">
				Login
			</button>
		</form>

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

    	async login() {
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

				this.$router.push({ name: 'messagesLink' });
			}
	
  }
}
</script>
