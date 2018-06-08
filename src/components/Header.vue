<template>
<div>
	<b-row class="text-center">

		<b-col sm="10" offset-sm="1" md="4" offset-md="4">
			<a href="/">
				<img src="../assets/logoH.png" class="img-fluid" alt="Dimakí logo">
			</a>
		</b-col>

		<b-col sm="12" md="2" offset-md="2" class="text-center pt-3">

			<strong v-if="userLogged">
				<router-link :to="{ name: 'userProfileLink' }">
					Your profile
				</router-link><br>
				(<router-link :to="{ name: 'messagesLink' }">
					<a href="" @click="logout">Logout</a>
				</router-link>)
			</strong>
			<strong v-else>
				<router-link :to="{ name: 'loginLink' }">
					Login
				</router-link>
			</strong>

		</b-col>

	</b-row>
	<b-row class="text-center">

		<b-col sm="12">
			<strong>
				(This app is currently under development. Please, report any error, suggestion or problem to <a href="mailto:dimaki.geo@gmail.com">dimaki.geo@gmail.com</a>)
			</strong>
		</b-col>
		

	</b-row>
</div>
</template>

<script>

	export default {
		props: ['userLogged'],
		methods: {
			logout() {
				this.$emit('logout', false);

				localStorage.removeItem("userToken");
			}
  	}
	}

</script>
