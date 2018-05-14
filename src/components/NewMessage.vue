<template>
	<div class="posts">
		<h1>Add Message</h1>

		<div class="form">
			<div>
				<textarea rows="10" cols="50" placeholder="Message text..." v-model="newMessage.text">
				</textarea>
			</div>
			<div>
				<button @click="addMessage">Add</button>
			</div>
		</div>
	</div>
</template>

<script>
	import apiAccess from '../apiAccess.js';

	export default {
		data() {
			return {
				newMessage: {
					latitude: 10,
					longitude: 10,
					text: ''
				}
			}
		},
		mounted() {
			navigator.geolocation.getCurrentPosition(this.onLocation,
																		(error) => console.log(error),
																		{ enableHighAccuracy : true });
		},
		methods: {

			onLocation(position) {
				this.newMessage.latitude = position.coords.latitude;
				//console.log("LATITUDE: " + this.latitude);
				this.newMessage.longitude = position.coords.longitude;
				//console.log("LONGITUDE: " + this.longitude);
			},
    	async addMessage() {
    		await apiAccess.addMessage(this.newMessage);

      	this.$router.push({ name: 'messagesLink' })
    	}
  }
}
</script>

<style>
	
</style>