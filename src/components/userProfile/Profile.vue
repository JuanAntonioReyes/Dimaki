<template>
<b-row class="text-center">

	<b-col sm="12">
		<h1>USER PROFILE</h1>
	</b-col>

</b-row>
</template>

<script>
	import apiAccess from '../../js/apiAccess.js';

	export default {
		data() {
			return {

				userData: {
					name: null,
					email: null,
				}

			}
		},

		mounted() {
			this.getUserData();
		},

		methods: {

			async getUserData() {
				// Get the user data
				var data = await apiAccess.getLoggedUser();
				
				console.log(data);
			}

  }
}
</script>
