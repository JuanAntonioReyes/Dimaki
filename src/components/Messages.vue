<template>
	<div class="posts">
		<h1>MESSAGES in your area<br>
		({{ location[0] }} / {{ location[1] }})</h1>
		TEST LATITUDE <input type="text" v-model="location[0]">
		TEST LONGITUDE <input type="text" v-model="location[1]">

		<table class="table table-hover">
			<thead class="thead-default">
				<tr>
					<th>Message</th>
					<th>Latitude</th>
					<th>Longitude</th>
				</tr>
			</thead>
			<tbody v-for="message in messages">
				<tr>
					<td>{{ message.text }}</td>
					<td>{{ message.geo[0] }}</td>
					<td>{{ message.geo[1] }}</td>
				</tr>
			</tbody>
		</table>

	</div>
</template>

<script>
	import apiAccess from '../apiAccess.js';

	export default {
		data() {
			return {
				//location: [ null, null ],
				location: [0, 0],
				messages: []
			}
		},
		mounted() {
			//console.log("LOCATION AT mounted() START: " + this.location);
			navigator.geolocation.getCurrentPosition(this.onLocation,
																					(error) => console.log(error),
																					{ enableHighAccuracy : true });

			this.getMessages();
			//console.log("LOCATION AT mounted() END: " + this.location);
		},
		methods: {

			onLocation(position) {
				//console.log("LOCATION AT onLocation() START: " + this.location);
				this.location[0] = position.coords.latitude;
				this.location[1] = position.coords.longitude;
				//console.log("LOCATION AT onLocation() END: " + this.location);
			},
			async getMessages() {
				//console.log("LOCATION AT getMessages() START: " + this.location);
				const response = await apiAccess.fetchMessages(this.location);
				this.messages = response.data;
				//console.log("LOCATION AT getMessages() END: " + this.location);
			}

		},
		watch: {
			location: function (val) {
				//console.log("--location watch called--");
				this.getMessages();
			}
		}
	}
</script>

<style>
	
</style>