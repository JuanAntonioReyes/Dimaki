<template>
	<div class="posts">
		<h1>Add Message from {{ newMessage.geo[0] }} / {{ newMessage.geo[1] }}</h1>
		TEST LATITUDE <input type="text" v-model="newMessage.location[0]">
		TEST LONGITUDE <input type="text" v-model="newMessage.location[1]">

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
					text: null,
					location: [],
					date: null,
					from: null,
					public: false,
					to: [],
					duration: null
				}
			}
		},
		mounted() {
			this.newMessage.text = '';
			this.newMessage.date = Date.now();
			this.newMessage.from = "User1";
			this.newMessage.public = true;
			this.newMessage.to = [];
			this.newMessage.duration = 1000;

			navigator.geolocation.getCurrentPosition(this.onLocation,
																		(error) => console.log(error),
																		{ enableHighAccuracy : true });
		},
		methods: {

			onLocation(position) {
				this.newMessage.location[0] = position.coords.longitude;
				this.newMessage.location[1] = position.coords.latitude;
			},
    	async addMessage() {
				await apiAccess.addMessage(this.newMessage);

				//this.$router.push({ name: 'messagesLink' })
			}
  }
}
</script>

<style>
	
</style>