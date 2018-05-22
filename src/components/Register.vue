<template>
	<div class="posts">
		<h1>Register user</h1>
<!-- 		<div class="form">
			<div>
				Name: <input type="text" v-model="newUser.name"><br>
				Password: <input type="password" v-model="newUser.pass"><br>
				e-mail: <input type="text" v-model="newUser.email"><br>
			</div>
			<div>
				<button @click="registerUser">Register</button>
			</div>
		</div> -->

		<!-- CONVERT THIS INTO BOOTSTRAP VUE NOTATION -->
		<form>
			<div class="form-group row">
				<label class="col-sm-3">Username</label>
				<div class="col-sm-9">
					<input type="text" class="form-control"
						id="name" v-model="newUser.name">
				</div>
			</div>
			<div class="form-group row">
				<label class="col-sm-3">e-mail</label>
				<div class="col-sm-9">
					<input type="email" class="form-control"
						id="pass" v-model="newUser.email">
				</div>
			</div>
			<div class="form-group row">
				<label class="col-sm-3">Password</label>
				<div class="col-sm-9">
					<input type="password" class="form-control"
						id="pass" v-model="newUser.pass">
				</div>
			</div>
			<button class="btn btn-primary" @click.prevent="registerUser">
				Register
			</button>
		</form>
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

<style>
	
</style>