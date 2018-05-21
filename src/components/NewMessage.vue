<template>
	<div class="posts">
		<h1>Add Message<br>
		<!-- ({{ newMessage.location[0] }} / {{ newMessage.location[1] }})</h1> -->
			({{ Number(this.newMessage.location.coordinates[1].toFixed(6)) }} / 
			{{ Number(this.newMessage.location.coordinates[0].toFixed(6)) }})
		</h1>
<!-- 		TEST LATITUDE <input type="text" v-model="newMessage.location[0]">
		TEST LONGITUDE <input type="text" v-model="newMessage.location[1]"><br> -->
		TEST LATITUDE <input type="text" v-model="newMessage.location.coordinates[1]">
		TEST LONGITUDE <input type="text" v-model="newMessage.location.coordinates[0]"><br>
		TEST USER <input type="text" v-model="newMessage.from"><br>
		TEST HIDDEN <input type="checkbox" v-model="newMessage.hidden"><br>
		TEST EXPIRATION <input type="text" v-model="newMessage.expirationDate">

		<div class="form">
			<div>
				<textarea rows="5" cols="50" placeholder="Message text..." v-model="newMessage.text">
				</textarea>
			</div>
			<div>
				<button @click="addMessage">Add</button>
			</div>
		</div>
	</div>
</template>

<script>
// TEMP USE OF THE SOLUTION FROM MESSAGES TO UPDATE THE DOM (ONLY WITH THE INPUTS
// FOR TESTING)
	import apiAccess from '../apiAccess.js';

	// REMOVE THIS WHEN THE TEST INPUTS ARE REMOVED?
	var checkStartLocationID;

	export default {
		data() {
			return {
				newMessage: {
					text: null,
					location: {
						type: 'Point',
						coordinates: [0, 0]
					},
					date: null,
					from: null,
					public: false,
					hidden: false,
					to: [],
					expirationDate: null
				}
			}
		},
		computed: {
			locationToFixed: function () {
				return this.location;
			}
		},
		mounted() {
			this.getUser();

			this.newMessage.text = '';
			this.newMessage.date = Date.now();
			this.newMessage.public = true;
			this.newMessage.to = [];
			this.newMessage.expirationDate = -1;

			// getCurrentPosition for testing, for real use use watchPosition
			//navigator.geolocation.watchPosition(this.onLocation,
			navigator.geolocation.getCurrentPosition(this.onLocation,
																		(error) => console.log(error),
																		{ enableHighAccuracy : true });

			// REMOVE THIS WHEN THE TEST INPUTS ARE REMOVED
			checkStartLocationID = setInterval(this.checkValues, 1000);			

		},
		methods: {

			// REMOVE THIS WHEN THE TEST INPUTS ARE REMOVED
			checkValues() { 
				if (this.newMessage.location.coordinates[0] != 0) {
					this.$forceUpdate();
					clearInterval(checkStartLocationID); 
				}
			},
			sleep(ms) {
				return new Promise(resolve => setTimeout(resolve, ms));
			},

			onLocation(position) {
				/*this.newMessage.location[0] = position.coords.latitude;
				this.newMessage.location[1] = position.coords.longitude;*/
/*				this.newMessage.location.coordinates[0] =
					Number(position.coords.longitude.toFixed(6));
				this.newMessage.location.coordinates[1] =
					Number(position.coords.latitude.toFixed(6));*/
				this.newMessage.location.coordinates[0] = position.coords.longitude;
				this.newMessage.location.coordinates[1] = position.coords.latitude;
			},
			async getUser() {
				var response = await apiAccess.getLoggedUser();

				this.newMessage.from = response.data.name;
			},
			async addMessage() {

				// TEMPORAL PATCH WHILE I HAVE THE INPUTs FOR COORDINATE TESTING
				this.newMessage.location.coordinates[0] =
					Number(this.newMessage.location.coordinates[0]);
				this.newMessage.location.coordinates[1] =
					Number(this.newMessage.location.coordinates[1]);

				await apiAccess.addMessage(this.newMessage);

				//console.log("TOKEN: " + userToken);

				this.$router.push({ name: 'messagesLink' });
			}
  }
}
</script>

<style>
	
</style>