<template>
<!-- 	<b-container class="messages mt-4"> -->
	<div class="messages">
		<b-row class="text-center">

			<b-col sm="12" class="mb-4">

<!-- 				<h2>
					You are at coords
					{{ Number(this.location[0].toFixed(6)) }} / 
					{{ Number(this.location[1].toFixed(6)) }}
				</h2> -->
				<!-- Change this for the commented above when
				the test location inputs are removed for production -->
				<h2>
					You are at coords
					{{ Number(Number(this.location[0]).toFixed(6)) }} / 
					{{ Number(Number(this.location[1]).toFixed(6)) }}
				</h2>

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
				<b-alert :variant="messageDetailVariant" dismissible
					:show="showMessageDetail" @dismissed="toggleMessageDetail">

					<div v-if="selected.index === -1">
						<div class="text-center">
							NO MESSAGE SELECTED
						</div>
					</div>
					<div v-else>
						<div v-if="selected.message.hidden">
							Secret message at coords:
						</div>
						<div v-else>
							Message at coords:
						</div>
						{{ selected.message.location.coordinates[1] }} /
						{{ selected.message.location.coordinates[0] }}<br><br>

						<div class="text-center">
							{{ selected.message.text }}
						</div>
						<br>
						<div class="text-right">
							- {{ selected.message.from }} -
						</div>
					</div>
					
				</b-alert>
<!-- / MESSAGE DETAIL -->

				TEST LATITUDE <input type="text" v-model="location[0]"><br>
				TEST LONGITUDE <input type="text" v-model="location[1]">
				
				<div v-if="noNearMessages" class="text-center">
					<h3>
						There isn't any messages in this area<br>
						<router-link :to="{ name: 'newMessageLink' }">
							Leave one now!
						</router-link>
					</h3>
				</div>
				<table v-else id="nearMessagesList" class="table table-hover">
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
							<td>{{ message.location.coordinates[1] }}</td>
							<td>{{ message.location.coordinates[0] }}</td>
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

<!-- 	</b-container>	 -->	
	</div>
</template>

<script>
	import apiAccess from '../apiAccess.js';
//------TESTING--------------------
	var sum = 0;
//------/TESTING--------------------
	//var checkStartLocationID;
	var mapData = {
									map: null,
									userMarker: null,
									messagesMarkers: [],
									nearMessagesMarkers: []
								};

	export default {
		data() {
			return {
				//location: [ null, null ],
				location: [ 0, 0 ],
				messages: [],
				nearMessages: [],
				showMessageDetail: false,
				selected: {
					index: -1,
					message: null,
					marker: null
				}
			}
		},
		computed: {
			noNearMessages: function () {
				return (this.nearMessages.length === 0);
			},
			messageDetailVariant: function () {
				var variant = 'info';

				if (this.selected.message && this.selected.message.hidden) {
					variant = 'warning';
				}

				return variant;
			}
		},
		async mounted() {
			//console.log("LOCATION AT mounted() START: " + this.location);
	
			// getCurrentPosition for testing, for real use use watchPosition
			navigator.geolocation.watchPosition(this.onLocation,
			//navigator.geolocation.getCurrentPosition(this.onLocation,
																					(error) => console.log(error),
																					{ enableHighAccuracy : true });

			this.initMap();

			// TODO: FIX THIS CORRECTLY!
			// Ugly solution for showing correctly the location data at start
			//checkStartLocationID = setInterval(this.checkValues, 1000);			

			//this.updateMap();
	
			//console.log("LOCATION AT mounted() END: " + this.location);
		},
		methods: {

/*			// Ugly solution for showing correctly the location data at start
			async checkValues() {
				// If you are exactly at 0, 0 when the app starts, this will fail
				// Very unlikely, but it might happen, who knows?
				if (this.location[0] != 0) {
					this.$forceUpdate();

					await this.getMessages();
					this.updateMap();

					clearInterval(checkStartLocationID); 
				}
			},*/

			onLocation(position) {
				//console.log("-- onLocation() called --");
				//console.log("LOCATION AT onLocation() START: " + this.location);
/*				this.location[0] =
					Number(position.coords.latitude.toFixed(6));
				this.location[1] =
					Number(position.coords.longitude.toFixed(6));*/

/*				this.location[0] = position.coords.latitude;
				this.location[1] = position.coords.longitude;*/
//------TESTING--------------------
				sum += 0.0002;
				this.$set( this.location, 0, position.coords.latitude + sum );
//------/TESTING--------------------
				//this.$set( this.location, 0, position.coords.latitude );
				this.$set( this.location, 1, position.coords.longitude );
				
				//this.$forceUpdate();

/*				console.log("Location: " + this.location);
				console.log("Latitude: " + position.coords.latitude);
				console.log("Latitude6: " + position.coords.latitude.toFixed(6));
				console.log("Latitude6N: " + Number(position.coords.latitude.toFixed(6)));
				console.log("Longitude: " + position.coords.longitude);
				console.log("Longitude6: " + position.coords.longitude.toFixed(6));
				console.log("Longitude6N: " + Number(position.coords.longitude.toFixed(6)));*/
				//console.log("LOCATION AT onLocation() END: " + this.location);
			},
			async getMessages() {
				//console.log("LOCATION AT getMessages() START: " + this.location);
//===============================================================
/*				var params = this.location.concat([5000, 50.01])
				var nearParams = this.location.concat([50, 0]);

				var response = await apiAccess.fetchMessages(params);
				var responseNear = await apiAccess.fetchMessages(nearParams);

				if (!this.selected.message) {
					// If we don't have any message selected replace all messages
					this.nearMessages = responseNear.data;
				} else {
					// If we have any message selected, put that message the first
					// on the near messages (Even if it is "Long" distance)
					if (this.selected.index !== 0) {
						this.changeListMessageBackground(this.selected.index, '');
						this.selected.index = 0;
						this.changeListMessageBackground(0, 'gray');	
					}

					this.nearMessages = [this.selected.message];

					response.data.forEach( (message, index) => {
						if (message._id !== this.selected.message._id) {
							this.messages.push(message);
						}
					});
					responseNear.data.forEach( (message, index) => {
						if (message._id !== this.selected.message._id) {
							this.nearMessages.push(message);
						}
					});

					// Remove the selected message from the responses
					response.data = response.data.filter(
							(message) => {	return message._id != this.selected.message });// || null;
					responseNear.data = responseNear.data.filter(
							(message) => { return message._id != this.selected.message });// || null;

					// Concat the nearResponse without the selected with de near messages
					this.nearMessages.concat(responseNear.data);
				}

				// The response will alway replace the full messages array
				// (When we have removed  the selected from it and also when we don't)
				this.messages = response.data;*/
//===============================================================

				// Parameters for searching the "long" distance messages (from 50 m to
				// 5 km) and the near messages (From 0 to 50 m)
				var params = this.location.concat([5000, 50.01])
				var nearParams = this.location.concat([50, 0]);

				// Get the messages ("Long" distance and near)
				var response = await apiAccess.fetchMessages(params);
				var responseNear = await apiAccess.fetchMessages(nearParams);
				
				// Remove the hidden messages from the "long" distance messages
				response.data = response.data.filter(	(message) =>
					{ return !message.hidden; });

				// Delete the previous messages
				this.messages.length = 0;
				this.nearMessages.length = 0;

				if (this.selected.message) {
					// If we have any message selected, put that message the first
					// on the near messages (To maintain it active even if the user
					// is not close to it)
					this.nearMessages = [this.selected.message];
					// If the previously selected was not in the 0 index, change
					// the color of that elemnet in the list, change the index and
					// color the first element of the messages list
					if (this.selected.index !== 0) {
						this.changeListMessageBackground(this.selected.index, '');
						this.selected.index = 0;
						this.changeListMessageBackground(0, 'gray');	
					}

					// Remove the selected message from the responses (It doesn't matter
					// in what response it is)
					response.data = response.data.filter(
							(message) => {
								return message._id !== this.selected.message._id;
							});
					responseNear.data = responseNear.data.filter(
							(message) => {
								return message._id !== this.selected.message._id;
							});
				}

				// Add the responses to their corresponding message array
				this.messages = this.messages.concat(response.data);
				this.nearMessages = this.nearMessages.concat(responseNear.data);

				//console.log("LOCATION AT getMessages() END: " + this.location);
			},
			initMap() {
				document.getElementById('map').textContent = "The map goes here";
				var uluru = {lat: this.location[0], lng: this.location[1]};
				
				mapData.map = new google.maps.Map(document.getElementById('map'), {
					zoom: 18,
					center: uluru
				});

				mapData.userMarker = new google.maps.Marker({
					position: uluru,
					icon: {
						path: google.maps.SymbolPath.CIRCLE,
						strokeColor: 'blue',
						scale: 5,
						strokeWeight: 5
					},
					map: mapData.map
				});

/*				var circle = new google.maps.Circle({
					map: mapData.map,
					radius: 5000, // In meters
					fillColor: '#AA0000'
				});

				circle.bindTo('center', mapData.userMarker, 'position');*/

				var circleNear = new google.maps.Circle({
					map: mapData.map,
					radius: 50, // In meters
					fillColor: '#00AA00',
					strokeWeight: 2
				});

				circleNear.bindTo('center', mapData.userMarker, 'position');
      },
      updateMap() {
				// Set the user marker position
				var newPoint = new google.maps.LatLng(this.location[0],
																							this.location[1]);

				mapData.userMarker.setPosition(newPoint);
				mapData.map.setCenter(newPoint);

/*				// - Generate messages markers for the map -
				// Backup the selected marker (If isn't any selected, it will be null)
				var selectedMarker = this.selected.marker;*/
				
/*				// Delete the previous markers ("Long" distance)
				mapData.messagesMarkers.forEach( (marker) => {
					marker.setMap(null);
				});
				mapData.messagesMarkers.length = 0;*/
				// Delete the previous markers that aren't in the new messages
				// list ("Long" distance)
				mapData.messagesMarkers.forEach( (marker, index) => {

					// If the marker is not in the new near messages list,
					// remove it from the map and from the nearMessagesMarkers array
					var inMessages = this.messages.filter( (message) => { return message._id === marker.messageId } )[0] || null;

					if (!inMessages) {
						marker.setMap(null);
						var ind = mapData.messagesMarkers.indexOf(marker);
						mapData.messagesMarkers.splice(ind, 1);
					}

				});

/*				// Delete the previous markers (Near)
				mapData.nearMessagesMarkers.forEach( (marker) => {
					marker.setMap(null);
				});
				mapData.nearMessagesMarkers.length = 0;*/
				// Delete the previous markers that aren't in the new messages
				// list (Near)
				var toDeleteIndexes = [];

				mapData.nearMessagesMarkers.forEach( (marker, index) => {
					// If the marker is not in the new near messages list,
					// remove it from the map and from the nearMessagesMarkers array
					var inMessages = this.nearMessages.filter( (message) =>
						{
							return message._id === marker.messageId;
						} )[0] || null;

					if (!inMessages) {
						marker.setMap(null);
						//var ind = mapData.nearMessagesMarkers.indexOf(marker);
						toDeleteIndexes.push(mapData.nearMessagesMarkers.indexOf(marker));
						//mapData.nearMessagesMarkers.splice(ind, 1);
					}

				});

				// Wee need to delete the markers outside the forAll with filter 
				// to not mess with the markers/index order
				mapData.nearMessagesMarkers = mapData.nearMessagesMarkers.filter(
					(marker, index) => {
						return !(toDeleteIndexes.includes(index));
					});

/*				if (selectedMarker) {
					// If we have a previous selected marker selected (It is not null)
					selectedMarker.setMap(mapData.map);
					mapData.nearMessagesMarkers.push(selectedMarker);
					selectedMarker.setAnimation(google.maps.Animation.BOUNCE);
				}*/

				// Generate the new markers and insert them in the map
				var newMessageMarker;

				// ("Long" distance)
				this.messages.forEach( (message, index) => {
					
					// If the message is not in the markers list, add a new marker
					var inMarkers = mapData.nearMessagesMarkers.filter( (marker) => { return marker.messageId === message._id } )[0] || null;

					if (!inMarkers) {
						var markerLat = message.location.coordinates[1];
						var markerLon = message.location.coordinates[0];
						var uluru = { lat: markerLat, lng: markerLon };

						newMessageMarker = new google.maps.Marker({
							position: uluru,
							icon: {
								path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
								strokeColor: 'red',
								scale: 4,
								strokeWeight: 4
							},
							map: mapData.map,
							messageId: message._id
						});
						
						newMessageMarker.addListener('click', () => {
																					this.toggleMessageDetail(-2);
																				});

						mapData.messagesMarkers.push(newMessageMarker);
					}

				});

				// (Near)
				this.nearMessages.forEach( (message, index) => {

/*					// If we don't have a selected marker or the selected marker
					// corresponds to a different message, we add a new marker
					// for that message
					if (!selectedMarker || (message._id !== selectedMarker.messageId)) {*/

						/*//var markerLat = message.location[0];
						//var markerLon = message.location[1];
						var markerLat = message.location.coordinates[1];
						var markerLon = message.location.coordinates[0];
						var uluru = { lat: markerLat, lng: markerLon };

						newMessageMarker = new google.maps.Marker({
							position: uluru,
							icon: {
								path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
								strokeColor: 'green',
								scale: 5,
								strokeWeight: 5
							},
							map: mapData.map,
							messageId: message._id
						});
						
						newMessageMarker.addListener('click', () => {
																					this.toggleMessageDetail(index);
																				});

						mapData.nearMessagesMarkers.push(newMessageMarker);*/

						var markerColor = message.hidden ? 'orange' : 'green';

						// If the message is not in the markers list, add a new marker
						var inMarkers = mapData.nearMessagesMarkers.filter( (marker) => 
							{ return marker.messageId === message._id } )[0] || null;

						if (!inMarkers) {
							var markerLat = message.location.coordinates[1];
							var markerLon = message.location.coordinates[0];
							var uluru = { lat: markerLat, lng: markerLon };

							newMessageMarker = new google.maps.Marker({
								position: uluru,
								icon: {
									path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
									strokeColor: markerColor,
									scale: 5,
									strokeWeight: 5
								},
								map: mapData.map,
								messageId: message._id
							});
							
							newMessageMarker.addListener('click', () => {
																						this.toggleMessageDetail(index);
																					});

							mapData.nearMessagesMarkers.push(newMessageMarker);
						}

/*					}*/
				});

			},
			toggleMessageDetail(messageIndex) {
				// MessageIndex:
				// -1 (No selected), -2 (Out of range), 0 to n (Near message)
				
				// If the user clicks the dismiss button of the alert
				if (messageIndex === undefined) {
					messageIndex = this.selected.index;
				}

				if (this.selected.marker && (messageIndex !== -2)) {
					// If we have a previously selected marker, stop it animation and
					// remove it from selected
					// This needs to happen if we select a new marker or if we deselect
					// one previously selected, but not if we select an out of range
					// marker (-2)
					this.selected.marker.setAnimation(null);
					this.selected.marker = null;

					// "Deselect" the message from the list (Change it background color)
					this.changeListMessageBackground(this.selected.index, '');
				}

				if (messageIndex === -2) {
					// If we select a marker out of range
					alert("This message is out of range\n" +
								"You must be closer to read it");
				} else if (messageIndex !== this.selected.index) {
					// If we select a marker or message different from the previously
					// selected, save it index and it message
					this.selected.index = messageIndex;
					this.selected.message = this.nearMessages[messageIndex];

					// Save the marker and animate it
					//this.selected.marker = mapData.nearMessagesMarkers[messageIndex];
					this.selected.marker =
						mapData.nearMessagesMarkers.filter(
							(marker) => { return marker.messageId === this.selected.message._id }
						)[0] || null;
					this.selected.marker.setAnimation(google.maps.Animation.BOUNCE);

					// "Select" the message from the list (Change it background color)
					this.changeListMessageBackground(messageIndex, 'gray');

					// Show the message detail
					this.showMessageDetail = true;
				} else {
					// If the same message is selected, we need to deselect it
					// Remove the message and the index from selected
					this.selected.index = -1;
					this.selected.message = null;

					// Hide the message detail
					this.showMessageDetail = false;
				}

			},
			changeListMessageBackground(index, background) {
					
				var messagesList = document.getElementById('nearMessagesList').tBodies;
				var prevStyle = messagesList[index].style;

/*				if (prevStyle.background === "") {
					prevStyle.background = "gray";
				} else {
					prevStyle.background = "";
				}*/

				prevStyle.background = background;

			}

		},
		watch: {
			location: async function (val) {
				//console.log("--location watch called--");
				await this.getMessages();
				this.updateMap();
			}
		}
	}
</script>

<style>
	
</style>