<template>
	<b-container class="messages mt-4">
		<b-row class="text-center">

			<b-col sm="12" class="mb-4">

				<h2>You are at coords {{ location[0] }} / {{ location[1] }}</h2>

				<router-link :to="{ name: 'newMessageLink' }">
					<b-button size="lg" variant="success">
						Leave a new message here!
					</b-button>
				</router-link>

			</b-col>

		</b-row>

		<b-row>
			<b-col sm="12" md="6">

<!-- MESSAGE DETAIL -->
				<b-alert variant="info" dismissible :show="showMessageDetail"
					@dismissed="toggleMessageDetail">

					<div v-if="selected.message">
						Message at coords:<br>
						{{ selected.message.location[0] }} /
						{{ selected.message.location[0] }}<br><br>

						<div class="text-center">
							{{ selected.message.text }}
						</div>
						<div class="text-right">
							- {{ selected.message.from }} -
						</div>
					</div>
					<div v-else>
						NO MESSAGE SELECTED
					</div>
					
				</b-alert>
<!-- / MESSAGE DETAIL -->

				TEST LATITUDE <input type="text" v-model="location[0]"><br>
				TEST LONGITUDE <input type="text" v-model="location[1]">
				<table class="table table-hover">
					<thead class="thead-default">
						<tr>
							<th>Message</th>
							<th>Latitude</th>
							<th>Longitude</th>
						</tr>
					</thead>
					<tbody v-for="(message, messageIndex) in nearMessages">
						<tr @click="toggleMessageDetail(messageIndex)">
							<td>
								{{ message.text.length > 10?
									(message.text.substring(0, 10) + '...'):
									message.text }}
							</td>
							<td>{{ message.location[0] }}</td>
							<td>{{ message.location[1] }}</td>
						</tr>
					</tbody>
				</table>

			</b-col>

			<b-col sm="12" md="6">
				<div id="map"></div>
			</b-col>
			
		</b-row>

<!-- 		<b-row>
			<b-col md="6">

				<h2>({{ location[0] }} / {{ location[1] }})</h2>
				<div id="map"></div>

			</b-col>
			<b-col md="6">

				TEST LATITUDE <input type="text" v-model="location[0]"><br>
				TEST LONGITUDE <input type="text" v-model="location[1]">
				<table class="table table-hover">
					<thead class="thead-default">
						<tr>
							<th>Message</th>
							<th>Latitude</th>
							<th>Longitude</th>
						</tr>
					</thead>
					<tbody v-for="message in nearMessages">
						<tr>
							<td>{{ message.text }}</td>
							<td>{{ message.location[0] }}</td>
							<td>{{ message.location[1] }}</td>
						</tr>
					</tbody>
				</table>

			</b-col>
		</b-row> -->

	</b-container>		
</template>

<script>
	import apiAccess from '../apiAccess.js';

	var checkStartLocationID;
	var mapData = {
									map: null,
									userMarker: null,
									nearMessagesMarkers: []
								};

	export default {
		data() {
			return {
				//location: [ null, null ],
				location: [ 0, 0 ],
				nearMessages: [],
				showMessageDetail: false,
				selected: {
					index: -1,
					message: null,
					marker: null
				}
			}
		},
		async mounted() {
			//console.log("LOCATION AT mounted() START: " + this.location);
	
			// getCurrentPosition for testing, for real use use watchPosition
			//navigator.geolocation.watchPosition(this.onLocation,
			navigator.geolocation.getCurrentPosition(this.onLocation,
																					(error) => console.log(error),
																					{ enableHighAccuracy : true });

			this.initMap();

			// TODO: FIX THIS CORRECTLY!
			// Ugly solution for showing correctly the location data at start
			checkStartLocationID = setInterval(this.checkValues, 1000);			

			//this.updateMap();
	
			//console.log("LOCATION AT mounted() END: " + this.location);
		},
		methods: {

			// Ugly solution for showing correctly the location data at start
			async checkValues() { 
				// If you are exactly at 0, 0 when the app starts, this will fail
				// Very unlikely, but it might happen, who knows?
				if (this.location[0] != 0) {
					this.$forceUpdate();

					await this.getMessages();
					this.updateMap();

					clearInterval(checkStartLocationID); 
				}
			},

			onLocation(position) {
				//console.log("LOCATION AT onLocation() START: " + this.location);
				this.location[0] = position.coords.latitude.toFixed(6);
				this.location[1] = position.coords.longitude.toFixed(6);
				//console.log("LOCATION AT onLocation() END: " + this.location);
			},
			async getMessages() {
				//console.log("LOCATION AT getMessages() START: " + this.location);

				const response = await apiAccess.fetchMessages(this.location);
				this.nearMessages = response.data;

				//console.log("LOCATION AT getMessages() END: " + this.location);
			},
			initMap() {
				document.getElementById('map').textContent = "The map goes here";
				var uluru = {lat: Number(this.location[0]), lng: Number(this.location[1])};
				
				mapData.map = new google.maps.Map(document.getElementById('map'), {
					zoom: 18,
					center: uluru
				});

				mapData.userMarker = new google.maps.Marker({
					position: uluru,
					map: mapData.map
				});

/*				var circle = new google.maps.Circle({
					map: mapData.map,
					radius: 50,
					fillColor: '#00AA00',
					strokeWeight: 2
				});

				circle.bindTo('center', mapData.userMarker, 'position');*/
      },
      updateMap() {
      	// Set the user marker position
				var newPoint = new google.maps.LatLng(this.location[0],
																							this.location[1]);

				mapData.userMarker.setPosition(newPoint);
				mapData.map.setCenter(newPoint);

				// - Generate messages markers for the map -

				// Delete the previous markers
				mapData.nearMessagesMarkers.forEach( (marker) => {
					marker.setMap(null);
				});
				mapData.nearMessagesMarkers.length = 0;

				// Generate the new markers and insert them in the map
				var newMessageMarker;

				this.nearMessages.forEach( (message, index) => {
					var markerLat = message.location[0];
					var markerLon = message.location[1];
					var uluru = { lat: markerLat, lng: markerLon };

					newMessageMarker = new google.maps.Marker({
						position: uluru,
						label: 'M',
						map: mapData.map
					});

					newMessageMarker.addListener('click', () => {
																				this.toggleMessageDetail(index);
																			});

					mapData.nearMessagesMarkers.push(newMessageMarker);
				});

			},
			toggleMessageDetail(messageIndex) {

				if (messageIndex === undefined) {
					messageIndex = this.selected.index;
				}

				if (this.selected.marker) {
					// If we have a marker already selected,
					// stop it animation and delete it
					this.selected.marker.setAnimation(null);
					this.selected.marker = null;
				}

				if (messageIndex !== this.selected.index) {
					// Save the index and the message
					this.selected.index = messageIndex;
					this.selected.message = this.nearMessages[messageIndex];

					// Save the marker and animate it
					this.selected.marker = mapData.nearMessagesMarkers[messageIndex];
					this.selected.marker.setAnimation(google.maps.Animation.BOUNCE);

					// Show the message detail
					this.showMessageDetail = true;
				} else {
					// Remove the message and the index from selected
					this.selected.index = -1;
					this.selected.message = null;

					// Hide the message detail
					this.showMessageDetail = false;
				}

			}

		},
		watch: {
			location: function (val) {
				//console.log("--location watch called--");
				this.getMessages();
				this.updateMap();
			}
		}
	}
</script>

<style>
	
</style>