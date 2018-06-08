<template>
<b-row class="text-center">

	<b-col sm="12" md="6">
		<h3>{{ userData.name }} ({{ userData.email }})</h3><br>
		Registered since: {{ userData.registerDate }}
	</b-col>

	<b-col sm="12" md="6">
		<pp-messages-list></pp-messages-list>
	</b-col>

</b-row>
</template>

<script>
	import apiAccess from '../../js/apiAccess.js';
	import MessagesList from './MessagesList.vue';

	export default {
		data() {
			return {

				userData: {
					name: null,
					email: null,
					registerDate: null
				}

			}
		},

		components: {
			ppMessagesList: MessagesList
  	},

		mounted() {
			this.getUserData();
		},

		methods: {

			async getUserData() {
				
				apiAccess.getLoggedUser()
				.then((response) => {
					this.userData.name = response.data.name;
					this.userData.email = response.data.email;

					var registerDate = new Date(response.data.registerDate);
					this.userData.registerDate = registerDate.toLocaleDateString();						
				})
				.catch((error) => {
					this.$router.push({ name: 'messagesLink' });
				});

			}

  }
}
</script>
