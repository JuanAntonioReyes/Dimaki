<template>
<div class="posts">
	<h1>Register user</h1>

	<b-form @submit="registerUser">

		<span id="info"></span>

		<b-row class="form-group">
			<b-col tag="label" sm="3">
				Username
			</b-col>
			<b-col sm="12" md="9">
				<input type="text" class="form-control" v-model="newUser.name">
			</b-col>
		</b-row>

		<b-row class="form-group">
			<b-col tag="label" sm="3">
				E-Mail
			</b-col>
			<b-col sm="12" md="9">
				<input type="email" class="form-control" v-model="newUser.email">
			</b-col>
		</b-row>

		<b-row class="form-group">
			<b-col tag="label" sm="3">
				Password
			</b-col>
			<b-col sm="12" md="9">
				<input type="password" class="form-control" v-model="newUser.pass">
			</b-col>
		</b-row>

		<b-row class="form-group">
			<b-col sm="12" class="text-center">
				<b-button type="submit" variant="success">
					Register user
				</b-button>
			</b-col>
		</b-row>

	</b-form>

</div>
</template>

<script>
	import apiAccess from '../js/apiAccess.js';

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

    	async registerUser(e) {
    		e.preventDefault();

				var infoSpan = document.getElementById('info');
				
				if (this.newUser.name && this.newUser.pass && this.newUser.email) {
					
					apiAccess.registerUser(this.newUser)
					.then((response) => {
						if (typeof(Storage) !== "undefined") {
							localStorage.setItem("userToken", response.data.token);
						} else {
							alert("Your browser does not support user token control\n" +
										"Please, update your browser to continue using this app");
						}

						this.$emit('login', true);

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
