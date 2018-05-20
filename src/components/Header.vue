<template>
	<b-row class="text-center">

		<b-col sm="12" md="10" offset-md="1">
			<a href="/" class="navbar-brand">
				<img src="../assets/logoH.png" alt="Dimakí logo" class="logo">
			</a>
		</b-col>
		
		<b-col sm="12" md="1">
			<strong v-if="loggedUser">
				<a href="" @click="logout">Logout</a>
			</strong>
			<strong v-else>
				<router-link :to="{ name: 'loginLink' }">
					<a href="" class="nav-link">Login</a>
				</router-link>
			</strong>
		</b-col>

	</b-row>
</template>

<script>

	export default {
		data() {
			return {
				loggedUser: false
			}
		},
		created() {
			if (localStorage.getItem("userToken")) {
				this.loggedUser = true;
			}
		},
		methods: {
			logout() {
				localStorage.removeItem("userToken");
				console.log("LOGGED OUT");
			}
  	}
	}

</script>

<style>
.logo {
	width: 25em;
}
</style>
