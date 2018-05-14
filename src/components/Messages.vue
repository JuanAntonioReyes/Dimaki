<template>
	<div class="posts">
		<h1>MESSAGES in your area<br>
		({{ location[0] }} / {{ location[1] }})</h1>
		
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
				location: [11, 11],
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
				this.location[0] = position.coords.latitude;
				this.location[1] = position.coords.longitude;
			},
			async getMessages() {
				const response = await apiAccess.fetchMessages(this.location);
				this.messages = response.data;
			}

		}
	}
</script>

<style>
	
</style>