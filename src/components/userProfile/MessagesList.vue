<template>
<b-row class="text-center">

	<b-col sm="12">
		<h4>YOUR MESSAGES</h4>

			<table class="table table-hover">

			<thead class="thead-default">
				<tr>
					<th>Message</th>
					<th>Latitude</th>
					<th>Longitude</th>
				</tr>
			</thead>

			<tbody v-for="(message) in userMessages">

				<tr>
					<td>
						{{ messageText(message) }}
					</td>
					<td>
						{{ message.location.coordinates[1].toFixed(6) }}
					</td>
					<td>
						{{ message.location.coordinates[0].toFixed(6) }}
					</td>
				</tr>

			</tbody>

		</table>
	</b-col>

</b-row>
</template>

<script>
	import apiAccess from '../../js/apiAccess.js';

	export default {
		data() {
			return {

				userMessages: []

			}
		},

		async mounted() {
			this.getUserMessages();
		},

		methods: {

			messageText(message) {
				if (message.text.length > 10) {
					return (message.text.substring(0, 10) + '...');
				}

				return message.text;
			},

			async getUserMessages() {
				var response = await apiAccess.fetchUserMessages();

				this.userMessages = response.data;
			}

		}
	}
</script>
