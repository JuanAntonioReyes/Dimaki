<template>
<div class="newMessage">

	<b-row class="text-center">

		<b-col sm="12" class="mb-2">

			<h4>Leave a new message at coords<br>
	 			({{ Number(this.newMessage.location.coordinates[1].toFixed(6)) }} / 
				{{ Number(this.newMessage.location.coordinates[0].toFixed(6)) }})
			</h4>

		</b-col>

	</b-row>

	<b-row>
		<b-col sm="12">
<!-- 				TEST USER <input type="text" v-model="newMessage.from"><br>
			TEST EXPIRATION <input type="text" v-model="newMessage.expirationDate"> -->

			<b-form @submit="addMessage">

				<b-row class="form-group">
					<b-col sm="12" md="4" offset-md="2" class="text-center">
						<b-form-checkbox v-model="newMessage.hidden">
							Hidden message
						</b-form-checkbox>

					</b-col>
					<b-col sm="12" md="4" class="text-center">
						{{ charactersLeft }} / 600<br>
					</b-col>
				</b-row>

				<b-row class="form-group">
					<b-col sm="12" md="8" offset-md="2">
						<textarea id="message" class="mb-2" @keyup="checkCharLeft"
							:maxlength="maxCharacters"  rows="7"
							placeholder="Message text..." v-model="newMessage.text" />
					</b-col>
				</b-row>

				<b-row class="form-group">
					<b-col sm="12" class="text-center">
						<b-button type="submit" size="lg" variant="success">
							Save message!
						</b-button>
					</b-col>
				</b-row>

			</b-form>

		</b-col>
	</b-row>

</div>
</template>

<script>
	import apiAccess from '../apiAccess.js';

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
				},

				maxCharacters: 600,

				charactersLeft: 600
			}
		},

		mounted() {
			this.getUser(); // Sets the newObject.from to the logged username

			this.newMessage.text = '';
			this.newMessage.date = Date.now();
			this.newMessage.public = true;
			this.newMessage.to = [];
			this.newMessage.expirationDate = -1;

			navigator.geolocation.watchPosition(this.onLocation,
																		(error) => console.log(error),
																		{ enableHighAccuracy : true });
		},

		methods: {

			checkCharLeft() {
				var messageTextArea = document.getElementById('message');
				var messageSize = messageTextArea.value.length;

				this.charactersLeft = (this.maxCharacters - messageSize);
			},

			onLocation(position) {
				this.$set( this.newMessage.location.coordinates, 0,
					position.coords.longitude );
				this.$set( this.newMessage.location.coordinates, 1,
					position.coords.latitude );
			},

			async getUser() {
				var response = await apiAccess.getLoggedUser();

				this.newMessage.from = response.data.name;
			},

			async addMessage(e) {
				e.preventDefault();

				this.newMessage.location.coordinates[0] =
					this.newMessage.location.coordinates[0];
				this.newMessage.location.coordinates[1] =
					this.newMessage.location.coordinates[1];
// ==============================================================
// TODO:
// CHECK HERE THAT ALL THE DATA IS SAVED AND CORRECT BEFORE
// MAKING THE API CALL!!!!
// ==============================================================
				await apiAccess.addMessage(this.newMessage);

				this.$router.push({ name: 'messagesLink' });
			}
  }
}
</script>

<style>
	textarea {
		width: 100%;
	}
</style>