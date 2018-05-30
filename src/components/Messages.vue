<template>
<div class="messages">

	<!-- Out of range message modal -->
	<b-modal ref="outOfRangeModal" title="Out of range message" size="sm" centered header-bg-variant="danger"
		header-text-variant="light" ok-variant="outline-danger" ok-only >

		<p class="text-center">
			This message is out of range<br>
			You must be closer to read it
		</p>

	</b-modal>

	<b-row class="text-center">
		<b-col sm="12" class="mb-4">

			<h4 v-if="availableLocation">
				You are at coords<br>
				{{ Number(this.location[0].toFixed(6)) }} / 
				{{ Number(this.location[1].toFixed(6)) }}
			</h4>
			<div v-else>
				<h4>
					Getting your geoposition...
				</h4>
				<h5>
					Wait a moment
				</h5>
			</div>

			<router-link :to="{ name: 'newMessageLink' }">
				<b-button variant="success">
					<strong>Leave a new message here!</strong>
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

					<!-- In theory this will never show, but just in case -->
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
			<!-- /MESSAGE DETAIL -->
			
			<div v-if="availableLocation">
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
								{{ messageText(message) }}
							</td>
							<td>
								{{ message.location.coordinates[1] }}
							</td>
							<td>
								{{ message.location.coordinates[0] }}
							</td>
						</tr>

					</tbody>

				</table>
			</div>
			<div v-else class="text-center">
				<h4>
					Loading messages...
				</h4>
			</div>

		</b-col>

		<b-col sm="12" md="6">
			<div id="map">
				<h4>
					Loading map...
				</h4>
			</div>
		</b-col>
		
	</b-row>

</div>
</template>

<script>
	import apiAccess from '../apiAccess.js';
/*//====== POSITION CHANGE TESTING ==========
// I use this values to simulate movement
	var sumLat = 0;
	var sumLon = 0;
//====== /POSITION CHANGE TESTING =========*/
	var mapData = {
									map: null,
									userMarker: null,
									messagesMarkers: [],
									nearMessagesMarkers: [],
									markerCluster: null
								};

	export default {
		data() {
			return {

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
			},

			availableLocation() {
				return (this.location[0] || this.location[1]);
			}

		},

		async mounted() {
			navigator.geolocation.watchPosition(this.onLocation,
																					(error) => console.log(error),
																					{ enableHighAccuracy : true });

			this.initMap();
			this.updateMap();
		},

		methods: {

			messageText(message) {
				if (message.text.length > 10) {
					return (message.text.substring(0, 10) + '...');
				}

				return message.text;
			},

			onLocation(position) {
/*//====== POSITION CHANGE TESTING ==========
				// Change this values and use the two set lines below instead of
				// the uncomented ones to miulate movement (Don't forget to comment
				// the other two)
				sumLat += 0.00010;
				sumLon += 0.00010;
				this.$set( this.location, 0, position.coords.latitude + sumLat );
				this.$set( this.location, 1, position.coords.longitude + sumLon );
//====== /POSITION CHANGE TESTING =========*/
				this.$set( this.location, 0, position.coords.latitude );
				this.$set( this.location, 1, position.coords.longitude );
			},

			async getMessages() {
				// Parameters [minDistance, maxDistance] for searching the "long"
				// distance messages (from 50.01 m to 5 km) and the near messages
				// (From 0 to 50 m)
				// (If we don't want a limit, we need to use 0 as maxDistance
				//var params = this.location.concat([50.01, 5000]);
				var params = this.location.concat([50.01, 0]);
				var nearParams = this.location.concat([0, 50]);

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
						// Change the selected marker position on the array
						mapData.nearMessagesMarkers.splice(this.selected.index, 1);
						mapData.nearMessagesMarkers.unshift(this.selected.marker);
						// Change the click event listener of the marker
						google.maps.event.clearListeners(this.selected.marker, 'click');
						this.selected.marker.addListener('click', () => {
																							this.toggleMessageDetail(0);
																						});

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
			},

			initMap() {
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

				var circleNear = new google.maps.Circle({
					map: mapData.map,
					radius: 50, // In meters
					fillColor: '#00AA00',
					strokeWeight: 2
				});

				circleNear.bindTo('center', mapData.userMarker, 'position');

				// Create the marker cluster
				var markerClusterImages =
					{ imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' };
				mapData.markerCluster = new MarkerClusterer(mapData.map, [], markerClusterImages);
      
			},

			updateMap() {
				// Set the user marker position
				var newPoint = new google.maps.LatLng(this.location[0],
																							this.location[1]);

				mapData.userMarker.setPosition(newPoint);
				mapData.map.setCenter(newPoint);

				// Delete the previous markers that are not in the new messages lists
				this.removeOldMarkers();

				// Generate the new markers and insert them in the map
				this.addNewMarkers();				

			},

			removeOldMarkers() {
				// Delete the previous markers that aren't in the new messages
				// list ("Long" distance)
				var toDeleteIndexes = [];
				mapData.messagesMarkers.forEach( (marker, index) => {

					// If the marker is not in the new near messages list,
					// remove it from the map and from the nearMessagesMarkers array
					var inMessages = this.messages.filter( (message) => {
							return message._id === marker.messageId
						} )[0] || null;

					if (!inMessages) {
						marker.setMap(null);
						toDeleteIndexes.push(mapData.messagesMarkers.indexOf(marker));
					}

				});

				// We need to delete the markers outside the forAll with filter 
				// to not mess with the markers/index order
				mapData.messagesMarkers = mapData.messagesMarkers.filter(
					(marker, index) => {
						return !(toDeleteIndexes.includes(index));
					});

				// Delete the previous markers that aren't in the new messages
				// list (Near)
				toDeleteIndexes.length = 0;
				mapData.nearMessagesMarkers.forEach( (marker, index) => {
					// If the marker is not in the new near messages list,
					// remove it from the map and from the nearMessagesMarkers array
					var inMessages = this.nearMessages.filter( (message) => {
							return message._id === marker.messageId;
						} )[0] || null;

					if (!inMessages) {
						marker.setMap(null);
						toDeleteIndexes.push(mapData.nearMessagesMarkers.indexOf(marker));
					}

				});

				mapData.nearMessagesMarkers = mapData.nearMessagesMarkers.filter(
					(marker, index) => {
						return !(toDeleteIndexes.includes(index));
					});
			},

			addMarker(message, index, type) {
				// Type:
				// 0 - "Long" distance, 1 - Near
				var markerColor, markerIcon, detailIndex;

				if (type === 0) {
					markerIcon = google.maps.SymbolPath.BACKWARD_OPEN_ARROW;
					markerColor = 'red';
					detailIndex = -2;
				} else if (type === 1) {
					markerIcon = google.maps.SymbolPath.BACKWARD_CLOSED_ARROW;
					detailIndex = index;
					markerColor = message.hidden ? 'orange' : 'green';
				}

				var markerLat = message.location.coordinates[1];
				var markerLon = message.location.coordinates[0];
				var uluru = { lat: markerLat, lng: markerLon };

				var newMessageMarker = new google.maps.Marker({
					position: uluru,
					icon: {
						path: markerIcon,
						strokeColor: markerColor,
						scale: 4,
						strokeWeight: 4
					},
					map: mapData.map,
					messageId: message._id
				});
				
				newMessageMarker.addListener('click', () => {
																			this.toggleMessageDetail(detailIndex);
																		});

				if (type === 0) {
					mapData.messagesMarkers.push(newMessageMarker);
				} else if (type === 1) {
					mapData.nearMessagesMarkers.push(newMessageMarker);
				}
			},

			addNewMarkers() {
				var newMessageMarker;

				// ("Long" distance)
				this.messages.forEach( (message, index) => {
					// If the message is not in the markers list, add a new marker
					var inMarkers = mapData.messagesMarkers.filter( (marker) =>
						{ return marker.messageId === message._id } )[0] || null;

					if (!inMarkers) {
						this.addMarker(message, index, 0);
					}

				});

				// (Near)
				this.nearMessages.forEach( (message, index) => {
						// If the message is not in the markers list, add a new marker
						var inMarkers = mapData.nearMessagesMarkers.filter( (marker) =>
							{ return marker.messageId === message._id } )[0] || null;

						if (!inMarkers) {
							this.addMarker(message, index, 1);
						}
				});

				// Add the newly generated markers to the marker cluster
				mapData.markerCluster.clearMarkers();
				mapData.markerCluster.addMarkers(mapData.messagesMarkers);
				mapData.markerCluster.addMarkers(mapData.nearMessagesMarkers);

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
					this.$refs.outOfRangeModal.show();
				} else if (messageIndex !== this.selected.index) {
					// If we select a marker or message different from the previously
					// selected, save it index and it message
					this.selected.index = messageIndex;
					this.selected.message = this.nearMessages[messageIndex];		

					// Save the marker and animate it
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

			changeListMessageBackground(index, backgroundColor) {
				var messagesList = document.getElementById('nearMessagesList').tBodies;
				var prevStyle = messagesList[index].style;

				prevStyle.background = backgroundColor;
			}

		},

		watch: {

			location: async function (val) {
				await this.getMessages();
				this.updateMap();
			}

		}
	}
</script>
