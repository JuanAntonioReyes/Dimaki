<template>
	<div class="posts">
		<h1>Add Message<br>
		({{ newMessage.location[0] }} / {{ newMessage.location[1] }})</h1>
		TEST LATITUDE <input type="text" v-model="newMessage.location[0]">
		TEST LONGITUDE <input type="text" v-model="newMessage.location[1]"><br>
		TEST USER <input type="text" v-model="newMessage.from"><br>
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

	// REMOVE THIS WHEN THE TEST INPUTS ARE REMOVED
	var checkStartLocationID;

	export default {
		data() {
			return {
				newMessage: {
					text: null,
					location: [0, 0],
					date: null,
					from: null,
					public: false,
					to: [],
					expirationDate: null
				}
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
				if (this.newMessage.location[0] != 0) {
					this.$forceUpdate();
					clearInterval(checkStartLocationID); 
				}
			},

			onLocation(position) {
				this.newMessage.location[0] = position.coords.latitude;
				this.newMessage.location[1] = position.coords.longitude;
			},
			async getUser() {
				var response = await apiAccess.getLoggedUser();

				this.newMessage.from = response.data.name;
			},
			async addMessage() {
				await apiAccess.addMessage(this.newMessage);

				//console.log("TOKEN: " + userToken);

				this.$router.push({ name: 'messagesLink' });
			}
  }
}
</script>

<style>
	
</style>