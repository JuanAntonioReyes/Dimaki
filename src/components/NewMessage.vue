<template>
<div class="newMessage">

	<b-row class="text-center">

		<b-col sm="12" class="mb-2">

			<h4 v-if="availableLocation">
				Leave a new message at coords<br>
				({{ Number(this.newMessage.location.coordinates[1].toFixed(6)) }} / 
				{{ Number(this.newMessage.location.coordinates[0].toFixed(6)) }})
			</h4>
			<div v-else>
				<h4>
					Getting your geoposition...
				</h4>
				<h5>
					Wait a moment
				</h5>
			</div>

		</b-col>

	</b-row>

	<b-row class="text-center">
		<b-col sm="12">
<!-- 				TEST USER <input type="text" v-model="newMessage.from"><br>
			TEST EXPIRATION <input type="text" v-model="newMessage.expirationDate"> -->

			<b-form @submit="addMessage">

				<span id="info"></span>

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
					hidden: null
				},

				maxCharacters: 600,

				charactersLeft: 600
			}
		},

		computed: {

			availableLocation() {
				return (this.newMessage.location.coordinates[0] || 
								this.newMessage.location.coordinates[1]);
			}

		},

		mounted() {
			this.newMessage.text = '';
			this.newMessage.hidden = false;

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

			async addMessage(e) {
				e.preventDefault();

				var infoSpan = document.getElementById('info');
				
				if (this.newMessage.location.coordinates[0] || 
						this.newMessage.location.coordinates[1]) {

						if (this.newMessage.text) {
							apiAccess.addMessage(this.newMessage)
							.then((response) => {
								this.$router.push({ name: 'messagesLink' });
							})
							.catch((error) => {
								infoSpan.textContent = error.response.data.message;
							});
						} else {
							infoSpan.textContent = "The message cannot be empty";
						}

				} else {
					infoSpan.textContent = "Wait a moment while we get your geoposition";
				}

			}
  	}
	}
</script>

<style>
	textarea {
		width: 100%;
	}
</style>