<template>
<b-row class="text-center">

	<b-col sm="12" md="4" offset-md="4">
		<a href="/">
			<img src="../assets/logoH.png" class="img-fluid" alt="Dimakí logo">
		</a>
	</b-col>

	<b-col sm="12" md="1" offset-md="3" class="text-center pt-3">

		<strong v-if="userLogged">
			<a href="" @click="logout"> Logout </a>
		</strong>
		<strong v-else>
			<router-link :to="{ name: 'loginLink' }">
				<a href="" class="nav-link"> Login </a>
			</router-link>
		</strong>

	</b-col>

</b-row>
</template>

<script>

	export default {
		computed: {
			userLogged: function () {
				return (localStorage.getItem("userToken") !== null);
			}
		},
		methods: {
			logout() {
				localStorage.removeItem("userToken");
			}
  	}
	}

</script>
