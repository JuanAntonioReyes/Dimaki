<template>
	<div class="posts">
		<h1>MESSAGES in your area<br>
		({{ latitude }} / {{ longitude }})</h1>
		
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
				latitude: null,
				longitude: null,
				messages: []
			}
		},
		mounted() {
			navigator.geolocation.getCurrentPosition(this.onLocation,
																					(error) => console.log(error),
																					{ enableHighAccuracy : true });

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