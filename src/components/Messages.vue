<template>
	<div class="posts">
		<h1>MESSAGES in {{ latitude }} / {{ longitude }}</h1>

		<tbody v-for="message in messages">
			<tr>
				<td>{{ message.text }}</td>
			</tr>
		</tbody>

	</div>
</template>

<script>
	import apiAccess from '../apiAccess.js';

	export default {
		data() {
			return {
				//latitude: null,
				//longitude: null,
				// LATITUDE and LONGITUDE fixed for test purposes
				latitude: 30.6060,
				longitude: -10.2323,
				messages: []
			}
		},
		mounted() {
			/*navigator.geolocation.getCurrentPosition(this.onLocation,
																					(error) => console.log(error),
																					{ enableHighAccuracy : true });
*/
			this.getMessages();
		},
		methods: {

			onLocation(position) {
				this.latitude = position.coords.latitude;
				//console.log("LATITUDE: " + this.latitude);
				this.longitude = position.coords.longitude;
				//console.log("LONGITUDE: " + this.longitude);
			},

			async getMessages() {
				const response = await apiAccess.fetchMessages();
				this.messages = response.data;
			}

		}
	}
</script>

<style>
	
</style>