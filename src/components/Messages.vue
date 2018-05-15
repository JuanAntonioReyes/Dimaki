<template>
	<b-container class="messages">
		<b-row>
			<b-col>

				<h2>({{ location[0] }} / {{ location[1] }})</h2>
				<div id="map"></div>

			</b-col>
			<b-col>
				<input type="checkbox" v-model="test">
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
					<tbody v-for="message in messages">
						<tr>
							<td>{{ message.text }}</td>
							<td>{{ message.location[0] }}</td>
							<td>{{ message.location[1] }}</td>
						</tr>
					</tbody>
				</table>

			</b-col>
		</b-row>
	</b-container>		
</template>

<script>
	import apiAccess from '../apiAccess.js';

	export default {
		data() {
			return {
				//location: [ null, null ],
				location: [ 0, 0 ],
				test: true,
				messages: [],
				mapData: {
					map: null,
					userMarker: null,
					messagesMarkers: []
				}
			}
		},
		mounted() {
			//console.log("LOCATION AT mounted() START: " + this.location);
			navigator.geolocation.watchPosition(this.onLocation,
																					(error) => console.log(error),
																					{ enableHighAccuracy : true });

			//this.getMessages();
			this.initMap();
			//this.updateMap();
			//console.log("LOCATION AT mounted() END: " + this.location);
		},
		updated() {
			this.updateMap();
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

				// Generate messages markers for the map
				this.mapData.messagesMarkers = [];
				var newMessageMarker;

				this.messages.forEach( (message) => {
					var lat = message.location[0];
					var lon = message.location[1];
					var uluru = {lat: lat, lng: lon};

					newMessageMarker = new google.maps.Marker({
						position: uluru,
						label: 'M',
						map: this.mapData.map
					});

					this.mapData.messagesMarkers.push(newMessageMarker);
				});

				//console.log("LOCATION AT getMessages() END: " + this.location);
			},
			initMap() {
				var uluru = {lat: Number(this.location[0]), lng: Number(this.location[1])};
				
				this.mapData.map = new google.maps.Map(document.getElementById('map'), {
					zoom: 18,
					center: uluru
				});

				this.mapData.userMarker = new google.maps.Marker({
          position: uluru,
          map: this.mapData.map
        });

/*				var circle = new google.maps.Circle({
					map: this.mapData.map,
					radius: 50,
					fillColor: '#00AA00',
					strokeWeight: 2
				});

				circle.bindTo('center', this.mapData.userMarker, 'position');*/
      },
      updateMap() {
      	var newPoint = new google.maps.LatLng(this.location[0], this.location[1]);

			  this.mapData.userMarker.setPosition(newPoint);
				this.mapData.map.setCenter(newPoint);
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